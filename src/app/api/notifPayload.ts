// lib/InitialNotificationPayloads.ts

export interface NotificationPayload {
  type: string;
  [key: string]: any; // Catch-all for differing notification fields (ex. policyId, etc.)
}

// Base class
export abstract class NotificationBase {
  userId: string;
  isRead: boolean;

  constructor(userId: string, isRead: boolean) {
    this.userId = userId;
    this.isRead = isRead;
  }

  // All notifications might be saved similarly, but subclasses can override.
  abstract saveToDatabase(): Promise<void>;
}

// PolicyNotification
export class PolicyNotification extends NotificationBase {
  policyId: string;
  subject: string;
  body: string;
  isArchived: boolean;

  constructor({
    userId,
    isRead,
    policyId,
    subject,
    body,
    isArchived,
  }: {
    userId: string;
    isRead: boolean;
    policyId: string;
    subject: string;
    body: string;
    isArchived: boolean;
  }) {
    super(userId, isRead);
    this.policyId = policyId;
    this.subject = subject;
    this.body = body;
    this.isArchived = isArchived;
  }

  async saveToDatabase(): Promise<void> {
    // Need to set up to database (Use ORM for data objects from the database?)
    console.log('Saving PolicyNotification to database:', this);
    return Promise.resolve();
  }
}

// NewsNotification
export class NewsNotification extends NotificationBase {
  createdDate: Date;
  expirationDate: Date;
  typeOfNews: string;
  title: string;
  details: string;

  constructor({
    userId,
    isRead,
    createdDate,
    expirationDate,
    typeOfNews,
    title,
    details,
  }: {
    userId: string;
    isRead: boolean;
    createdDate: Date;
    expirationDate: Date;
    typeOfNews: string;
    title: string;
    details: string;
  }) {
    super(userId, isRead);
    this.createdDate = createdDate;
    this.expirationDate = expirationDate;
    this.typeOfNews = typeOfNews;
    this.title = title;
    this.details = details;
  }

  async saveToDatabase(): Promise<void> {
    // Need to set up to database (Use ORM for data objects from the database?)
    console.log('Saving NewsNotification to database:', this);
    return Promise.resolve();
  }
}

// ClaimsNotification
export class ClaimsNotification extends NotificationBase {
  insuredName: string;
  claimantName: string;
  taskType: string;
  dueDate: Date;
  lineOfBusiness: string;
  description: string;
  priority: string;
  isCompleted: boolean;

  constructor({
    userId,
    isRead,
    insuredName,
    claimantName,
    taskType,
    dueDate,
    lineOfBusiness,
    description,
    priority,
    isCompleted,
  }: {
    userId: string;
    isRead: boolean;
    insuredName: string;
    claimantName: string;
    taskType: string;
    dueDate: Date;
    lineOfBusiness: string;
    description: string;
    priority: string;
    isCompleted: boolean;
  }) {
    super(userId, isRead);
    this.insuredName = insuredName;
    this.claimantName = claimantName;
    this.taskType = taskType;
    this.dueDate = dueDate;
    this.lineOfBusiness = lineOfBusiness;
    this.description = description;
    this.priority = priority;
    this.isCompleted = isCompleted;
  }

  async saveToDatabase(): Promise<void> {
    // Need to set up to database (Use ORM for data objects from the database?)
    console.log('Saving ClaimsNotification to database:', this);
    return Promise.resolve();
  }
}

// Factory function for creating notifications.
export function createNotificationInstance(payload: NotificationPayload): NotificationBase {
  const { type } = payload;

  switch (type) {
    case 'policy':
      return new PolicyNotification({
        userId: payload.userId,
        isRead: payload.isRead,
        policyId: payload.policyId,
        subject: payload.subject,
        body: payload.body,
        isArchived: payload.isArchived,
      });

    case 'news':
      return new NewsNotification({
        userId: payload.userId,
        isRead: payload.isRead,
        createdDate: new Date(payload.createdDate),
        expirationDate: new Date(payload.expirationDate),
        typeOfNews: payload.typeOfNews,
        title: payload.title,
        details: payload.details,
      });

    case 'claims':
      return new ClaimsNotification({
        userId: payload.userId,
        isRead: payload.isRead,
        insuredName: payload.insuredName,
        claimantName: payload.claimantName,
        taskType: payload.taskType,
        dueDate: new Date(payload.dueDate),
        lineOfBusiness: payload.lineOfBusiness,
        description: payload.description,
        priority: payload.priority,
        isCompleted: payload.isCompleted,
      });

    default:
      throw new Error(`Invalid notification type: ${type}`);
  }
}
