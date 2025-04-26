/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { Mail, AlertCircle, Flag, Search, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Priority = 'low' | 'medium' | 'high';
type Folder = 'inbox' | 'flagged' | 'sent' | 'drafts';

interface Message {
  notification_id: number;
  sender_id: number;
  recipient_id: number;
  type: string;
  text: string;
  subject: string;
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
  'Claims',
  'News',
  'Policy',
];

const priorityColors: Record<Priority, string> = {
  low: 'bg-yellow-100 text-yellow-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

const allowedTypeColors: Record<string, string> = {
  Claims: 'bg-blue-100 text-blue-700',
  News: 'bg-green-100 text-green-700',
  Policy: 'bg-purple-100 text-purple-700',
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
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    type: '',
    subject: '',
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
      type: "Policy",
      subject: "Your Policy Renewal Notice – Action Required",
      timestamp: "2025-03-30 14:44",
      is_read: false,
      is_active: true,
      priority: "high",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8002,
      sender_id: 201,
      recipient_id: 202,
      type: "Claims",
      subject: "Claim #34321: Additional Information Needed",
      timestamp: "2025-03-30 15:00",
      is_read: true,
      is_active: true,
      priority: "medium",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8003,
      sender_id: 205,
      recipient_id: 204,
      type: "Claims",
      subject: "Proof of Address Required to Finalize Your Claim",
      timestamp: "2025-03-29 09:10",
      is_read: true,
      is_active: true,
      priority: "low",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8004,
      sender_id: 208,
      recipient_id: 207,
      type: "Policy",
      subject: "Temporary Coverage Summary for Rental Vehicle",
      timestamp: "2025-03-30 11:00",
      is_read: false,
      is_active: true,
      priority: "medium",
      flagged: true,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8005,
      sender_id: 210,
      recipient_id: 209,
      type: "News",
      subject: "Your Monthly Statement is Ready",
      timestamp: "2025-03-28 16:43",
      is_read: true,
      is_active: true,
      priority: "low",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8006,
      sender_id: 203,
      recipient_id: 213,
      type: "News",
      subject: "Storm Damage Coverage Tips You Should Know",
      timestamp: "2025-03-27 13:27",
      is_read: true,
      is_active: true,
      priority: "high",
      flagged: true,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8007,
      sender_id: 206,
      recipient_id: 202,
      type: "News",
      subject: "Update: New Discount Opportunities Available",
      timestamp: "2025-03-30 10:00",
      is_read: false,
      is_active: true,
      priority: "medium",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8008,
      sender_id: 205,
      recipient_id: 203,
      type: "Claims",
      subject: "We’ve Received Your Claim – What Happens Next",
      timestamp: "2025-03-31 07:15",
      is_read: true,
      is_active: true,
      priority: "low",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8009,
      sender_id: 204,
      recipient_id: 210,
      type: "Policy",
      subject: "Verify Your Contact Information to Avoid Delays",
      timestamp: "2025-03-30 18:25",
      is_read: true,
      is_active: true,
      priority: "medium",
      flagged: true,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8010,
      sender_id: 208,
      recipient_id: 210,
      type: "Policy",
      subject: "Let’s Review Your Auto Policy Together",
      timestamp: "2025-03-28 17:50",
      is_read: true,
      is_active: true,
      priority: "high",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8011,
      sender_id: 207,
      recipient_id: 206,
      type: "Claims",
      subject: "Claim #98721 has been recieved and is now being reviewed",
      timestamp: "2025-03-28 17:30",
      is_read: false,
      is_active: true,
      priority: "medium",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8012,
      sender_id: 202,
      recipient_id: 209,
      type: "Claims",
      subject: "Claim #21843 has been reviewed",
      timestamp: "2025-03-27 16:00",
      is_read: true,
      is_active: true,
      priority: "low",
      flagged: true,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8013,
      sender_id: 202,
      recipient_id: 210,
      type: "News",
      subject: "Welcome to DuckCreek – What’s Next",
      timestamp: "2025-03-30 12:44",
      is_read: false,
      is_active: true,
      priority: "medium",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8014,
      sender_id: 210,
      recipient_id: 202,
      type: "Policy",
      subject: "Your Insurance Card is Now Available Online",
      timestamp: "2025-03-31 09:30",
      is_read: true,
      is_active: true,
      priority: "high",
      flagged: false,
      folder: "inbox",
      text: ''
    },
    {
      notification_id: 8015,
      sender_id: 201,
      recipient_id: 202,
      type: "News",
      subject: "Please verify your email for DuckCreek Notification services",
      timestamp: "2025-03-31 10:20",
      is_read: false,
      is_active: true,
      priority: "medium",
      flagged: false,
      folder: "inbox",
      text: ''
    },
  ]);

  const handleSend = () => {
    if (!newMessage.type || !newMessage.subject) return;

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
    if (!newMessage.type || !newMessage.subject) return; // Ensure required fields are not empty
  
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
      subject: "",
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
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Dark Mode Toggle */}
      <button
        className="absolute top-4 right-4 z-50 text-yellow-500 dark:text-yellow-300 hover:text-yellow-600"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <div className="flex w-full max-w-6xl mx-auto p-4 gap-6">
        <Sidebar selected={selectedFolder} setSelected={setSelectedFolder} onCompose={() => setIsComposing(true)} />
        <div className="flex-1">      
          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 w-full max-w-md bg-white shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="subject"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by message subject..."
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

              <div className="flex-1 px-4 text-gray-900 font-medium flex items-center gap-2">
  {msg.subject.length >= 30 ? (msg.subject.slice(0, 30) + '...') : msg.subject}
</div>

              {/* Type */}
              <div className="flex gap-2 items-center">
              <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${allowedTypeColors[msg.type]}`}
                >
                  {msg.type}
                </span>


              {/* Priority */}
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