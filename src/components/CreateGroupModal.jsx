import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, Plus, Users, UserPlus } from 'lucide-react';

const CreateGroupModal = ({ isOpen, onClose, userEmail }) => {
  const [groupName, setGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [membersList, setMembersList] = useState([]);

  // Add an email to the temporary list
  const addMemberToList = () => {
    const email = memberEmail.trim().toLowerCase();
    if (email && !membersList.includes(email) && email !== userEmail) {
      setMembersList([...membersList, email]);
      setMemberEmail("");
    }
  };

  // Remove a member before creating
  const removeMember = (emailToRemove) => {
    setMembersList(membersList.filter(email => email !== emailToRemove));
  };

  // Save the group to Firestore
  const createGroup = async () => {
    if (!groupName.trim()) return alert("Please enter a group name");
    if (membersList.length === 0) return alert("Add at least one member");

    try {
      await addDoc(collection(db, "rooms"), {
        name: groupName,
        type: "group",
        members: [userEmail, ...membersList], // Include the creator
        createdBy: userEmail,
        updatedAt: serverTimestamp(),
        lastMessage: `Group "${groupName}" created`
      });
      
      // Reset and close
      setGroupName("");
      setMembersList([]);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Check your connection.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users size={24} />
            <h2 className="text-xl font-bold italic tracking-tight">Create Vesta Group</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Group Name Input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Group Name</label>
            <input 
              className="w-full border-2 border-gray-100 p-3 rounded-xl mt-1 outline-none focus:border-orange-500 transition-all" 
              placeholder="e.g. Project Vesta Team" 
              value={groupName} 
              onChange={e => setGroupName(e.target.value)} 
            />
          </div>

          {/* Add Members Input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Add Members (Gmail ID)</label>
            <div className="flex gap-2 mt-1">
              <input 
                className="flex-1 border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-orange-500 transition-all" 
                placeholder="friend@gmail.com" 
                value={memberEmail} 
                onChange={e => setMemberEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMemberToList()}
              />
              <button 
                onClick={addMemberToList}
                className="bg-orange-100 text-orange-600 p-3 rounded-xl hover:bg-orange-200 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Members Chip List */}
          <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] max-h-32 overflow-y-auto p-1">
            {membersList.length === 0 && <p className="text-gray-300 text-sm italic">No members added yet...</p>}
            {membersList.map(email => (
              <div key={email} className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-orange-200">
                {email}
                <button onClick={() => removeMember(email)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Create Button */}
          <button 
            onClick={createGroup} 
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Launch Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;