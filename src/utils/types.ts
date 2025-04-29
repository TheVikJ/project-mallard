export interface Message {
  id: number;
  sender: string;
  recipient: string;
  type: string; // 'policy' | 'claim' | 'news'
  subject: string;
  body: string;
  priority: number; // 0 | 1 | 2
  is_read: boolean;
  is_flagged: boolean;
  timestamp: Date;
};

export interface Filters {
  type?: string; // 'policy' | 'claims' | 'news' | undefined
  sender?: string;
  recipient?: string;
  priority?: number; // 0 | 1 | 2 | undefined
  isFlagged?: boolean;
  isDraft?: boolean;
};
