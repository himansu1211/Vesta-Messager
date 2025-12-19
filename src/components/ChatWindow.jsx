import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase/config';
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp, doc, updateDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Paperclip, Send, File, Image as ImageIcon, Loader2 } from 'lucide-react';

const ChatWindow = ({ room, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const endRef = useRef(null);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now'; // Less than 1 minute
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`; // Less than 1 hour
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); // Today
    if (diff < 604800000) return date.toLocaleDateString('en-US', { weekday: 'long' }); // This week
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Older
  };

  // 1. Listen for messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, "rooms", room.id, "messages"), 
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [room.id]);

  // 2. Send Text Message
  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText(""); // Clear input immediately for better UX

    await addDoc(collection(db, "rooms", room.id, "messages"), {
      text: messageText,
      senderEmail: user.email,
      createdAt: serverTimestamp(),
      type: "text"
    });

    await updateDoc(doc(db, "rooms", room.id), {
      lastMessage: messageText,
      updatedAt: serverTimestamp()
    });
  };

  // 3. Upload File (Free Tier Friendly)
  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileRef = ref(storage, `vesta/${room.id}/${Date.now()}_${file.name}`);
      const snap = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snap.ref);

      await addDoc(collection(db, "rooms", room.id, "messages"), {
        fileUrl: url,
        fileName: file.name,
        fileType: file.type,
        senderEmail: user.email,
        createdAt: serverTimestamp(),
        type: "file"
      });
      
      setUploading(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Make sure your Storage Rules are set to public!");
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* Chat Header */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center gap-3 shadow-lg z-10">
        <div className="w-10 h-10 rounded-3xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-lg animate-pulse">
          {room.type === 'group' ? 'G' : 'D'}
        </div>
        <div className="flex-1">
          <span className="font-bold text-gray-800 text-lg">
            {room.type === 'group' ? room.name : room.members.find(m => m !== user.email)}
          </span>
          <p className="text-xs text-slate-500">{room.type === 'group' ? `${room.members.length} members` : 'Direct Message'}</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/50 to-white custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderEmail === user.email ? 'justify-end' : 'justify-start'} group`}>
            <div className={`p-4 rounded-3xl max-w-[75%] shadow-lg transition-all hover:shadow-xl ${
              m.senderEmail === user.email
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-tr-md'
                : 'bg-white border border-slate-200/50 text-gray-800 rounded-tl-md'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs opacity-70 font-bold lowercase">{m.senderEmail.split('@')[0]}</p>
                <span className="text-xs opacity-50 flex items-center gap-1">
                  <Clock size={10} />
                  {formatTimestamp(m.createdAt)}
                </span>
              </div>

              {m.type === 'file' ? (
                <a href={m.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:underline p-2 rounded-xl bg-black/10 transition-all">
                  {m.fileType?.includes('image') ? <ImageIcon size={24} className="text-blue-500"/> : <File size={24} className="text-gray-500"/>}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate block">{m.fileName}</span>
                    <span className="text-xs opacity-70">Click to view</span>
                  </div>
                </a>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={onSend} className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/50 flex gap-3 items-center shadow-lg">
        <label className="cursor-pointer text-slate-400 hover:text-orange-500 p-3 rounded-2xl hover:bg-orange-50 transition-all hover:scale-110">
          {uploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={22} />
              <span className="text-xs font-medium">Sending...</span>
            </div>
          ) : (
            <Paperclip size={22} />
          )}
          <input type="file" className="hidden" onChange={onUpload} disabled={uploading}/>
        </label>

        <input
          className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-3xl outline-none text-sm border border-slate-200/50 focus:border-orange-500 focus:bg-white transition-all shadow-md focus:shadow-orange-100"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <button
          disabled={!text.trim() || uploading}
          className="bg-orange-500 text-white p-4 rounded-3xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:bg-gray-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
        >
          <Send size={20}/>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;