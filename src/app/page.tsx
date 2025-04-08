'use client'
import { useState } from 'react';

// import { policy_notifs, claim_notifs, news_notifs } from '@prisma/client';

export default function Home() {
  const readStatuses = ['All', 'Unread', 'Read'];
  const [readStatus, setReadStatus] = useState<string>('All');
  const changeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReadStatus(event.target.value);
    // setIsFetching(true);

    // setIsFetching(false);
  };

  const notifTypes = ['All', 'Policy', 'Claim', 'News'];
  const [notifType, setNotifType] = useState<string>('All');
  const changeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifType(event.target.value);
    // setIsFetching(true);

    // setIsFetching(false);
  };

  // const [notifications, setNotifications] = useState<(policy_notifs | claim_notifs | news_notifs)[]>([]);
  // const [isFetching, setIsFetching] = useState<boolean>(true);

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
      <div className='flex-4'>
        {/*
          isFetching ? <p>Loading...</p> : (
            <>
            </>
          )
        */}
      </div>
    </div>
  );
}
