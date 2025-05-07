/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { Mail, AlertCircle, Flag, Search, X, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Message, Filters } from '@/utils/types';

type Priority = 'Low' | 'Medium' | 'High';
type Folder = 'inbox' | 'flagged' | 'sent' | 'drafts';

interface SidebarProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<Folder>>;
  onCompose: () => void;
}

const allowedTypes: string[] = [
  'Claims',
  'News',
  'Policy',
];

const priorityColors: Record<Priority, string> = {
  Low: 'bg-yellow-100 text-yellow-700',
  Medium: 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
};

const allowedTypeColors: Record<string, string> = {
  Claims: 'bg-blue-100 text-blue-700',
  News: 'bg-green-100 text-green-700',
  Policy: 'bg-purple-100 text-purple-700',
  };


const Sidebar: React.FC<SidebarProps> = ({ selected, setSelected, onCompose }) => (
  <div className="w-48 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md self-start">
    <div
      className="bg-gray-300 dark:bg-gray-700 text-center py-2 font-semibold rounded-md mb-6 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600"
      onClick={onCompose}
    >
      Compose
    </div>
    <ul className="space-y-2">
      {(() => {
        const folders: Folder[] = ['inbox', 'flagged', 'sent', 'drafts'];
        return folders.map((item) => (
          <li
            key={item}
            className={`capitalize px-3 py-2 rounded-md cursor-pointer ${
              selected === item
                ? 'bg-blue-200 dark:bg-blue-600 font-semibold'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSelected(item)}
          >
            {item}
          </li>
        ));
      })()}
    </ul>
  </div>
);

const MessageList: React.FC = () => {
  const router = useRouter();

  const [selectedFolder, setSelectedFolder] = useState<Folder>('inbox');
  const [search, setSearch] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null); // State to track selected message
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    type: '',
    subject: '',
    body: '',
    priority: 0,
    is_flagged: false,
    is_read: false,
    sender: '',
    recipient: '',
    timestamp: new Date(),
  });

  const [messageData, setMessageData] = useState<Message[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mallard-user');
    if (!stored || !JSON.parse(stored).username) {
      alert('Authentication error. Please log in again.')
      router.push('/login');
      return;
    }
    const username = JSON.parse(stored).username;

    const filters: Map<Folder, Filters> = new Map<Folder, Filters>([
      ['inbox', {
        recipient: username || undefined,
        isDraft: false,
      }],
      ['drafts', {
        sender: username || undefined,
        isDraft: true,
      }],
      ['flagged', {
        recipient: username || undefined,
        isDraft: false,
        isFlagged: true,
      }],
      ['sent', {
        sender: username || undefined,
        isDraft: false,
      }],
    ]);

    (async () => {
      const filter = filters.get(selectedFolder);

      const res = await axios.post<Message[]>('/api/getallnotifs', filter);
      const data: Message[] = res.data;

      setMessageData(data);
    })();
  }, [router, selectedFolder]);

  const handleBackToList = () => {
    setSelectedMessage(null); // Reset selected message to go back to the list
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // const handleSend = () => {
  //   if (!newMessage.type || !newMessage.subject) return;

  //   setMessageData([
  //     {
  //       ...(newMessage as Message),
  //       folder: 'sent',
  //       notification_id: Date.now(),
  //       timestamp: new Date(),
  //     },
  //     ...messageData,
  //   ]);
  //   setIsComposing(false);
  //   setNewMessage({});
  // };

  // const handleSaveDraft = () => {
  //   if (!newMessage.type || !newMessage.subject) return; // Ensure required fields are not empty
  
  //   setMessageData((prevMessages) => [
  //     {
  //       ...(newMessage as Message),
  //       folder: "drafts",
  //       notification_id: Date.now(),
  //       timestamp: new Date().toISOString(),
  //     },
  //     ...prevMessages,
  //   ]);
  
  //   // Close the popup
  //   setIsComposing(false);
  
  //   // Ensure the drafts folder is selected in the sidebar
  //   setSelectedFolder("drafts");
  
  //   // Reset newMessage state so input fields clear
  //   setNewMessage({
  //     type: "",
  //     subject: "",
  //     priority: "Low",
  //     flagged: false,
  //     folder: "drafts",
  //     is_active: true,
  //     is_read: false,
  //     notification_id: Date.now(),
  //     sender_id: 201,
  //     recipient_id: 202,
  //     timestamp: new Date().toISOString(),
  //   });
  // };

  // const filteredMessages = messageData.filter((msg) => {
  //   const matchesFolder =
  //     selectedFolder === 'flagged'
  //       ? msg.is_flagged && msg.folder !== 'drafts'
  //       : msg.folder === selectedFolder;

  //   const matchesSearch = msg.type
  //     .toLowerCase()
  //     .includes(search.toLowerCase());

  //   return matchesFolder && matchesSearch;
  // });

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Dark Mode Toggle */}
      <button
        className="absolute top-4 right-4 z-50 text-yellow-500 dark:text-yellow-300 hover:text-yellow-600"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Moon className="w-6 h-6" />
        ) : (
          <Sun className="w-6 h-6" />
        )}
      </button>
      
      <div className="flex w-full max-w-6xl mx-auto p-4 gap-6">
        <Sidebar selected={selectedFolder} setSelected={setSelectedFolder} onCompose={() => setIsComposing(true)} />
        <div className="flex-1">
          {!selectedMessage ? (
            <>
              {/* Search Bar */}
              <div className="mb-4 flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 w-full max-w-md bg-white dark:bg-gray-800 shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by message type..."
                  className="w-full outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Message List */}
              {messageData.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={'cursor-pointer flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 mb-3 shadow-sm'}
                >
                  {/* Date + Flag */}
                  <div className="flex items-center w-30 text-sm text-gray-500">
                    <div className="w-9 flex justify-center">
                      {msg.is_flagged && selectedFolder !== 'drafts' && <Flag className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 text-left">{new Date(msg.timestamp).toDateString()}</div>
                  </div>

                  <div className="flex-1 px-4 text-gray-900 font-medium flex items-center gap-2">
                    {msg.subject.length >= 30 ? (msg.subject.slice(0, 30) + '...') : msg.subject}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-35 ml-4 shrink-0 text-sm text-gray-600 dark:text-gray-300">
                    {/* Type */}
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${allowedTypeColors[msg.type]}`}>
                        {msg.type}
                      </span>
                    </div>

                    {/* Priority */}
                    <div className="flex justify-center">
                      {(() => {
                        const _: Priority = msg.priority === 0 ? 'Low' :
                                            msg.priority === 1 ? 'Medium' : 'High';
                        return (
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${priorityColors[_]}`}>
                            {_}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <button onClick={handleBackToList} className="mb-4 text-blue-600 hover:underline">
                Back to list
              </button>
              <h2 className="text-2xl font-semibold mb-2">{selectedMessage.subject}</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>From: {selectedMessage.sender}</span> | <span>To: {selectedMessage.recipient}</span> | <span>{new Date(selectedMessage.timestamp).toISOString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${allowedTypeColors[selectedMessage.type]}`}>
                  {selectedMessage.type}
                </span>

                {(() => {
                  const _: Priority = selectedMessage.priority === 0 ? 'Low' :
                                      selectedMessage.priority === 1 ? 'Medium' : 'High';
                  return (
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${priorityColors[_]}`}>
                      {_}
                    </span>
                  );
                })()}

                {selectedMessage.is_flagged && <Flag className="w-4 h-4 text-red-500" />}
              </div>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedMessage.body}</p>
            </div>
          )}
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