import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import {
  collection, query, where, onSnapshot,
  addDoc, serverTimestamp, doc, getDoc, orderBy
} from 'firebase/firestore';
import { Search, LogOut, Users, MessageSquare, ChevronLeft, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './ChatWindow';
import CreateGroupModal from './CreateGroupModal';

const ChatMain = ({ user }) => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("list"); // 'list' shows sidebar, 'chat' shows conversation

  // Listen for Rooms
  useEffect(() => {
    const q = query(
      collection(db, "rooms"),
      where("members", "array-contains", user.email),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user.email]);

  const startDirectChat = async () => {
    const targetEmail = searchEmail.trim().toLowerCase();
    if (!targetEmail || targetEmail === user.email) return;

    const userRef = doc(db, "users", targetEmail);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found! They must log in to Vesta first.");
      return;
    }

    const roomID = [user.email, targetEmail].sort().join("_");
    try {
      await addDoc(collection(db, "rooms"), {
        type: "direct",
        members: [user.email, targetEmail],
        lastMessage: "New conversation",
        updatedAt: serverTimestamp()
      });
      setSearchEmail("");
    } catch (e) { setSearchEmail(""); }
  };

  const handleSelectRoom = (room) => {
    setActiveRoom(room);
    setView("chat"); // Switch to chat view on mobile
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userEmail={user.email} />

      {/* Sidebar */}
      <AnimatePresence>
        {(view === 'list' || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col w-full md:w-[400px] bg-white border-r border-gray-200 h-full shadow-lg"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  V
                </div>
                <h1 className="text-xl font-bold text-gray-800">Vesta</h1>
              </div>
              <button onClick={() => auth.signOut()} className="p-2 text-gray-500 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <input
                  className="w-full bg-gray-100 p-3 pl-10 rounded-full outline-none text-sm border border-gray-300 focus:border-orange-500"
                  placeholder="Search or start new chat..."
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startDirectChat()}
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`p-4 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
                    activeRoom?.id === room.id ? 'bg-orange-50 border-r-4 border-orange-500' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {room.type === 'group' ? <Users size={20} /> : room.members.find(m => m !== user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {room.type === 'group' ? room.name : room.members.find(m => m !== user.email).split('@')[0]}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=f97316&color=fff&size=48`}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <AnimatePresence>
        {(view === 'chat' || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 flex flex-col bg-[#e5ddd5] h-full"
          >
            {activeRoom ? (
              <>
                {/* Mobile Back Button */}
                <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200">
                  <button onClick={() => setView('list')} className="p-2 text-orange-500">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="ml-2">
                    <p className="font-bold text-gray-800">
                      {activeRoom.type === 'group' ? activeRoom.name : activeRoom.members.find(m => m !== user.email).split('@')[0]}
                    </p>
                  </div>
                </div>
                <ChatWindow room={activeRoom} user={user} />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-[#e5ddd5]">
                <MessageSquare size={80} className="text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">Vesta Messenger</h2>
                <p className="text-gray-500">Encrypted & Fast</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default ChatMain;
