'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Notification } from '@/utils/types';

export default function Home() {
  const readStatuses = ['All', 'Unread', 'Read'];
  const [readStatus, setReadStatus] = useState<string>('All');
  const changeStatus = (event: React.ChangeEvent<HTMLInputElement>) => { setReadStatus(event.target.value); };

  const notifTypes = ['All', 'Policy', 'Claim', 'News'];
  const [notifType, setNotifType] = useState<string>('All');
  const changeType = (event: React.ChangeEvent<HTMLInputElement>) => { setNotifType(event.target.value); };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const getNotifs = async () => {
      setIsFetching(true);
      setNotifications(await fetchData());
      setIsFetching(false);
    }
    getNotifs();
  }, [readStatus, notifType]);

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <div className='flex-1 flex flex-col items-center bg-gray-100'>
        {/* Title */}
        <h1 className='my-10'>Mallard</h1>

        {/* Filters */}
        <div>
          <h2>Filters</h2>

          <h3>Read status</h3>
          {
            readStatuses.map((status: string) => (
              <label key={status}>
                <input
                  key={status}
                  type='radio'
                  value={status}
                  checked={status === readStatus}
                  onChange={changeStatus}/>
                {status}
              </label>
            ))
          }

          <h3>Notification type</h3>
          {
            notifTypes.map((type: string) => (
              <label key={type}>
                <input
                  key={type}
                  type='radio'
                  value={type}
                  checked={type === notifType}
                  onChange={changeType}/>
                {type}
              </label>
            ))
          }
        </div>

        {/* Logout */}
        <div>
          <button>Logout</button>
        </div>
        
      </div>

      {/* Main page */}
      <div className='flex-4 flex flex-col items-center'>
        <h2 className='my-10'>Notifications</h2>
        {
          isFetching ? <p>Loading...</p> :
            notifications.map((notification, i: number) => {
              return (
                <div key={i} className='px-2 py-0.5 w-5/6 grid grid-cols-8 rounded-md shadow-md hover:bg-gray-100'>
                  {
                    (() => {
                      if (notification.PolicyNotif) return (
                        <>
                          <h3>Policy</h3>
                          <p>ID: {notification.PolicyNotif.policy_id}</p>
                          <p className='col-span-5'>{notification.PolicyNotif.subject}</p>
                        </>
                      );
                      else if (notification.ClaimNotif) return (
                        <>
                          <h3>Claim</h3>
                          <p>Priority: {notification.ClaimNotif.priority}</p>
                          <p className='col-span-2'>{notification.ClaimNotif.business}</p>
                          <p className='col-span-4'>{notification.ClaimNotif.description}</p>
                        </>
                      )
                      else return (
                        <>
                          <h3>News</h3>
                          <p>Type: {notification.NewsNotif.type}</p>
                          <p className='col-span-5'>{notification.NewsNotif.title}</p>
                        </>
                      )
                    })()
                  }
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

async function fetchData() {
  const response = await axios.get<Notification[]>('/api/getall/johndoe');
  console.log(response.data);
  return response.data;
}
