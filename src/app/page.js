/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react';
import { Mail, AlertCircle, Flag, Search } from 'lucide-react';

const allowedTypes = [
  'Claim Update',
  'Follow-Up Question',
  'Policy Reminder',
  'Claim Field',
  'Investigation Statement',
  'Policy Inquiry',
  'System Notice',
  'Document Upload',
];

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};


const messages = [
  {
    notification_id: 8001,
    sender_id: 202,
    recipient_id: 201,
    type: "Claim Update",
    text: "Your claim #893...",
    timestamp: "2025-03-30 14:44",
    is_read: false,
    is_active: true,
    priority: "high",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8002,
    sender_id: 201,
    recipient_id: 202,
    type: "Follow-Up Question",
    text: "Can you clarify w...",
    timestamp: "2025-03-30 15:00",
    is_read: true,
    is_active: true,
    priority: "medium",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8003,
    sender_id: 205,
    recipient_id: 204,
    type: "Policy Reminder",
    text: "Your homeowner...",
    timestamp: "2025-03-29 09:10",
    is_read: true,
    is_active: true,
    priority: "low",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8004,
    sender_id: 208,
    recipient_id: 207,
    type: "Claim Update",
    text: "The damage esti...",
    timestamp: "2025-03-30 11:00",
    is_read: false,
    is_active: true,
    priority: "medium",
    flagged: true,
    folder: "inbox",
  },
  {
    notification_id: 8005,
    sender_id: 210,
    recipient_id: 209,
    type: "Policy Reminder",
    text: "We've updated y...",
    timestamp: "2025-03-28 16:43",
    is_read: true,
    is_active: true,
    priority: "low",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8006,
    sender_id: 203,
    recipient_id: 213,
    type: "Claim Update",
    text: "We've received y...",
    timestamp: "2025-03-27 13:27",
    is_read: true,
    is_active: true,
    priority: "high",
    flagged: true,
    folder: "inbox",
  },
  {
    notification_id: 8007,
    sender_id: 206,
    recipient_id: 202,
    type: "Investigation Statement",
    text: "We've initiated a...",
    timestamp: "2025-03-30 10:00",
    is_read: false,
    is_active: true,
    priority: "medium",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8008,
    sender_id: 205,
    recipient_id: 203,
    type: "System Notice",
    text: "New login from u...",
    timestamp: "2025-03-31 07:15",
    is_read: true,
    is_active: true,
    priority: "low",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8009,
    sender_id: 204,
    recipient_id: 210,
    type: "Follow-Up Question",
    text: "Please rate your...",
    timestamp: "2025-03-30 18:25",
    is_read: true,
    is_active: true,
    priority: "medium",
    flagged: true,
    folder: "inbox",
  },
  {
    notification_id: 8010,
    sender_id: 208,
    recipient_id: 210,
    type: "Document Upload",
    text: "All requested do...",
    timestamp: "2025-03-28 17:50",
    is_read: true,
    is_active: true,
    priority: "high",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8011,
    sender_id: 207,
    recipient_id: 206,
    type: "Claim Update",
    text: "Still awaiting adj...",
    timestamp: "2025-03-28 17:30",
    is_read: false,
    is_active: true,
    priority: "medium",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8012,
    sender_id: 202,
    recipient_id: 209,
    type: "Claim Update",
    text: "Claim #21843 has...",
    timestamp: "2025-03-27 16:00",
    is_read: true,
    is_active: true,
    priority: "low",
    flagged: true,
    folder: "inbox",
  },
  {
    notification_id: 8013,
    sender_id: 202,
    recipient_id: 210,
    type: "Policy Inquiry",
    text: "What’s the proces...",
    timestamp: "2025-03-30 12:44",
    is_read: false,
    is_active: true,
    priority: "medium",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8014,
    sender_id: 210,
    recipient_id: 202,
    type: "Claim Update",
    text: "Images from ins...",
    timestamp: "2025-03-31 09:30",
    is_read: true,
    is_active: true,
    priority: "high",
    flagged: false,
    folder: "inbox",
  },
  {
    notification_id: 8015,
    sender_id: 201,
    recipient_id: 202,
    type: "Follow-Up Question",
    text: "Still waiting to he...",
    timestamp: "2025-03-31 10:20",
    is_read: false,
    is_active: true,
    priority: "medium",
    flagged: false,
    folder: "inbox",
  },
];

const Sidebar = ({ selected, setSelected }) => (
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

const MessageList = () => {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [search, setSearch] = useState('');

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