/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Mail, AlertCircle, Flag, Search, X } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';
type Folder = 'inbox' | 'flagged' | 'sent' | 'drafts';

interface Message {
  notification_id: number;
  sender_id: number;
  recipient_id: number;
  type: string;
  text: string;
  timestamp: string;
  is_read: boolean;
  is_active: boolean;
  priority: Priority;
  flagged: boolean;
  folder: Folder | string;
}

interface SidebarProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  onCompose: () => void;
}

const allowedTypes: string[] = [
  'Claim Update',
  'Follow-Up Question',
  'Policy Reminder',
  'Claim Field',
  'Investigation Statement',
  'Policy Inquiry',
  'System Notice',
  'Document Upload',
];

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

const Sidebar: React.FC<SidebarProps> = ({ selected, setSelected, onCompose }) => (
  <div className="w-48 bg-gray-100 p-4 rounded-xl shadow-md">
    <div
      className="bg-gray-300 text-center py-2 font-semibold rounded-md mb-6 cursor-pointer hover:bg-gray-400"
      onClick={onCompose}
    >
      Compose
    </div>
    <ul className="space-y-2">
      {['inbox', 'flagged', 'sent', 'drafts'].map((item) => (
        <li
          key={item}
          className={`capitalize px-3 py-2 rounded-md cursor-pointer ${
            selected === item ? 'bg-blue-200 font-semibold' : 'hover:bg-gray-200'
          }`}
          onClick={() => setSelected(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const MessageList: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [search, setSearch] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    type: '',
    text: '',
    priority: 'low',
    flagged: false,
    folder: 'drafts',
    is_active: true,
    is_read: false,
    notification_id: Date.now(),
    sender_id: 201,
    recipient_id: 202,
    timestamp: new Date().toISOString(),
  });
  const [messageData, setMessageData] = useState<Message[]>([
    {
      notification_id: 8001,
      sender_id: 202,
      recipient_id: 201,
      type: 'Claim Update',
      text: 'Your claim #893...',
      timestamp: '2025-03-30 14:44',
      is_read: false,
      is_active: true,
      priority: 'high',
      flagged: false,
      folder: 'inbox',
    },
    {
      notification_id: 8002,
      sender_id: 201,
      recipient_id: 202,
      type: 'Follow-Up Question',
      text: 'Can you clarify w...',
      timestamp: '2025-03-30 15:00',
      is_read: true,
      is_active: true,
      priority: 'medium',
      flagged: false,
      folder: 'inbox',
    },
    {
      notification_id: 8003,
      sender_id: 201,
      recipient_id: 202,
      type: 'Policy Reminder',
      text: 'Reminder that your policy must be...',
      timestamp: '2025-04-11 10:00',
      is_read: false,
      is_active: true,
      priority: 'low',
      flagged: true,
      folder: 'inbox',
    },
    {
      notification_id: 8004,
      sender_id: 202,
      recipient_id: 201,
      type: 'Investigation Statement',
      text: 'We recieved a notice that...',
      timestamp: '2025-04-24 9:00',
      is_read: false,
      is_active: true,
      priority: 'high',
      flagged: true,
      folder: 'inbox',
    },
    {
      notification_id: 8005,
      sender_id: 201,
      recipient_id: 202,
      type: 'Policy Reminder',
      text: 'Reminder that your policy must be...',
      timestamp: '2025-04-11 10:00',
      is_read: false,
      is_active: true,
      priority: 'low',
      flagged: false,
      folder: 'inbox',
    },
  ]);

  const handleSend = () => {
    if (!newMessage.type || !newMessage.text) return;

    setMessageData([
      {
        ...(newMessage as Message),
        folder: 'sent',
        notification_id: Date.now(),
        timestamp: new Date().toISOString(),
      },
      ...messageData,
    ]);
    setIsComposing(false);
    setNewMessage({});
  };

  const handleSaveDraft = () => {
    if (!newMessage.type || !newMessage.text) return; // Ensure required fields are not empty
  
    setMessageData((prevMessages) => [
      {
        ...(newMessage as Message),
        folder: "drafts",
        notification_id: Date.now(),
        timestamp: new Date().toISOString(),
      },
      ...prevMessages,
    ]);
  
    // Close the popup
    setIsComposing(false);
  
    // Ensure the drafts folder is selected in the sidebar
    setSelectedFolder("drafts");
  
    // Reset newMessage state so input fields clear
    setNewMessage({
      type: "",
      text: "",
      priority: "low",
      flagged: false,
      folder: "drafts",
      is_active: true,
      is_read: false,
      notification_id: Date.now(),
      sender_id: 201,
      recipient_id: 202,
      timestamp: new Date().toISOString(),
    });
  };

  const filteredMessages = messageData.filter((msg) => {
    const matchesFolder =
      selectedFolder === 'flagged'
        ? msg.flagged && msg.folder !== 'drafts'
        : msg.folder === selectedFolder;

    const matchesSearch = msg.type
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFolder && matchesSearch;
  });

  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mx-auto p-4 gap-6">
        <Sidebar selected={selectedFolder} setSelected={setSelectedFolder} onCompose={() => setIsComposing(true)} />

        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 w-full max-w-md bg-white shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by message type..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* Message List */}
          {filteredMessages.map((msg) => (
            <div
              key={msg.notification_id}
              className={`flex items-center justify-between border-b py-3 ${!msg.is_active ? 'opacity-50' : ''}`}
            >
              {/* Date + Flag */}
              <div className="flex items-center w-32 text-sm text-gray-500">
                {msg.flagged && msg.folder !== 'drafts' && (
                  <Flag className="w-4 h-4 text-red-500 mr-2" />
                )}
                {msg.timestamp}
              </div>

              {/* Type */}
              <div className="flex-1 px-4 text-gray-900 font-medium flex items-center gap-2">
                {msg.type}
              </div>

              {/* Priority */}
              <div className="flex gap-2 items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${priorityColors[msg.priority]}`}
                >
                  {msg.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isComposing && (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      {/* Background Overlay */}
      <div 
        onClick={() => setIsComposing(false)} 
      />

      {/* Popup Window */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-lg z-50">
        {/* Close Button */}
        <button 
          onClick={() => setIsComposing(false)} 
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold text-gray-800">Compose Your Message</h2>

        {/* Recipient Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
        </div>

        {/* Subject Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select className="w-full border rounded-md px-2 py-1">
            <option value="">Select Type</option>
            {allowedTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Message Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea className="w-full border rounded-md px-2 py-2 focus:ring focus:ring-blue-300" rows={4} />
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select className="w-full border rounded-md px-2 py-1">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">Save Draft</button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md">Send</button>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};

const Page = () => {
  return <MessageList />;
};

export default Page;