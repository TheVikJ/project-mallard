'use client';

import React, { useEffect, useState } from 'react';
import { Flag, Search, X, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Message, Filters } from '@/utils/types';


type Priority = 'Low' | 'Medium' | 'High';
type Folder = 'inbox' | 'flagged' | 'sent' | 'drafts';

interface SidebarProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<Folder>>;
  onCompose: () => void;
}

const allowedTypes: string[] = [
  'Claim',
  'News',
  'Policy',
];

const priorityColors: Record<Priority, string> = {
  Low: 'bg-yellow-100 text-yellow-700',
  Medium: 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
};

const allowedTypeColors: Record<string, string> = {
  Claim: 'bg-blue-100 text-blue-700',
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

  // Dark mode states and effects
  const [darkMode, setDarkMode] = useState<boolean>(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);


  // Notification display: states
  const [selectedFolder, setSelectedFolder] = useState<Folder>('inbox');
  const [search, setSearch] = useState<string>('');
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null); // State to track selected message
  
  // Notification display: effects
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

  // Notification display: functions
  const handleBackToList = () => {
    setSelectedMessage(null); // Reset selected message to go back to the list
  };

  
  // Message creation: states
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [formData, setFormData] = useState({ recipient: '' });
  const [newMessageType, setNewMessageType] = useState<string>('Claim');
  const [claimDueDate, setClaimDueDate] = useState<Date | null>();
  const [newsCreatedDate, setNewsCreatedDate] = useState<Date | null>();
  const [newsExpiresDate, setNewsExpiresDate] = useState<Date | null>();

  // Message creation: functions
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewMessageType(event.target.value);
    setClaimDueDate(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? value === '' ? '' : Number(value) : value;

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('mallard-user');
    if (!stored || !JSON.parse(stored).username) {
      alert('Authentication error. Please log in again.')
      router.push('/login');
      return;
    }
    const username = JSON.parse(stored).username;

    const { recipient, ..._data } = formData;
    const data = {
      ..._data,
      due_date: claimDueDate? claimDueDate : undefined,
      created_on: newsCreatedDate? newsCreatedDate : undefined,
      expires_on: newsExpiresDate? newsExpiresDate : undefined,
    };

    try {
      await axios.post(`/api/addnotif/${username}`, {
        type: newMessageType.toLowerCase(),
        recipient,
        data,
      });
      alert('Message sent!');
    }
    catch (err) {
      console.error('Submission error:', err);
    }

    setIsComposing(false);
  };

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
  // inside MessageList, above your return():
  const handleToggleFlag = async (id: number) => {
    // find the message we’re toggling
    const msg = messageData.find((m) => m.id === id)
    if (!msg) return

    const newFlag = !msg.is_flagged

    try {
      // call your PATCH /api/editnotif endpoint
      // console.log(`${msg.type} ${msg.id} ${newFlag} ${msg.sender}`)
      await axios.patch(`/api/editnotif/${msg.sender}/${msg.id}`, {
        type: msg.type,
        edits: { is_flagged: newFlag }
      })

      // update local state
      setMessageData((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, is_flagged: newFlag } : m
        )
      )
    } catch (err) {
      console.error('Error toggling flag:', err)
    }
  }

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
                {/* Date + Flag as a button */}
                <div className="flex items-center w-30 text-sm text-gray-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFlag(msg.id);
                        }}
                        className="w-9 flex justify-center"
                        aria-label={msg.is_flagged ? 'Unflag message' : 'Flag message'}
                      >
                        <Flag
                          className={`w-4 h-4 ${
                            msg.is_flagged ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
                          }`}
                        />
                      </button>
                      <div className="flex-1 text-left">
                        {new Date(msg.timestamp).toDateString()}
                      </div>
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
        <form className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50" onSubmit={handleSubmit}>
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
              <input name="recipient" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" className="w-full border rounded-md px-2 py-1" onChange={handleTypeChange}>
                {allowedTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Conditional formatting for the different notification types */}
            {
              (() => {
                return newMessageType === 'Policy' ? (
                  <>
                    {/* Policy ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Policy ID</label>
                      <input name="policy_id" onChange={handleFormChange} type="number" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subject</label>
                      <input name="subject" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Body</label>
                      <textarea name="body" onChange={handleFormChange} className="w-full border rounded-md px-2 py-2 focus:ring focus:ring-blue-300" rows={4} />
                    </div>
                  </>
                ) : newMessageType === 'Claim' ? (
                  <>
                    {/* Policy Holder */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Policy Holder</label>
                      <input name="policy_holder" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Claimant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Claimant</label>
                      <input name="claimant" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <input name="type" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Business */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business</label>
                      <input name="business" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea name="description" onChange={handleFormChange} className="w-full border rounded-md px-2 py-2 focus:ring focus:ring-blue-300" rows={4} />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <DatePicker name="due_date" selected={claimDueDate} onChange={date => setClaimDueDate(date)} />
                    </div>
                  </>
                ) : newMessageType === 'News' ? (
                  <>
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <input name="type" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input name="title" onChange={handleFormChange} type="text" className="w-full border rounded-md px-2 py-1 focus:ring focus:ring-blue-300" />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Body</label>
                      <textarea name="body" onChange={handleFormChange} className="w-full border rounded-md px-2 py-2 focus:ring focus:ring-blue-300" rows={4} />
                    </div>

                    {/* Created On */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created On</label>
                      <DatePicker name="created_on" selected={newsCreatedDate} onChange={date => setNewsCreatedDate(date)} />
                    </div>

                    {/* Expires On */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expires On</label>
                      <DatePicker name="expires_on" selected={newsExpiresDate} onChange={date => setNewsExpiresDate(date)} />
                    </div>
                  </>
                ) : <></>;
              })()
            }

            {/* Priority Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select name="priority" className="w-full border rounded-md px-2 py-1">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">Save Draft</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md">Send</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

const Page = () => {
  return <MessageList />;
};

export default Page;