export type Notification = {
  id: number;
  sender: string;
  recipient: string;
  is_active: boolean;
  PolicyNotif: PolicyNotif;
  ClaimNotif: ClaimNotif;
  NewsNotif: NewsNotif;
}

export type PolicyNotif = {
  id: number;
  policy_id: number;
  subject: string;
  body: string;
  is_read: boolean;
  is_archived: boolean;
  Notification: Notification;
  created_at: Date;
}

export type ClaimNotif = {
  id: number;
  policy_holder: string;
  claimant: string;
  business: string;
​​  ​description: string;
  type: string;
  priority: number;
  due_date: Date;
  is_completed: boolean;
  Notification: Notification;
  created_at: Date;
}

export type NewsNotif = {
  id: number;
  title: string;
  type: string;
  created_on: Date;
  expires_on: Date;
  Notification: Notification;
  created_at: Date;
}