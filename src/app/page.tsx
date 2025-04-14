/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Mail, AlertCircle, Flag, Search } from 'lucide-react';

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

const messages: Message[] = [
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
  // ... (rest of the message data unchanged)
];

const Sidebar: React.FC<SidebarProps> = ({ selected, setSelected }) => (
  <div className="w-48 bg-gray-100 p-4 rounded-xl shadow-md">
    <div className="bg-gray-300 text-center py-2 font-semibold rounded-md mb-6 cursor-pointer hover:bg-gray-400">
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

  const filteredMessages = messages.filter((msg) => {
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
    <div className="flex w-full max-w-6xl mx-auto p-4 gap-6">
      <Sidebar selected={selectedFolder} setSelected={setSelectedFolder} />
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
  );
};

export default MessageList;
