This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# **API Endpoint Documentation:**
## **1. Create Notification**
### **POST /api/addnotif/{senderId}**
Creates a new notification (policy, claim, or news) for a single recipient.

**Route Params**

- `senderId` (string): the sender’s username.

**Request Body**
<br>

 ```json
  Example Body
  {  
    "type": "policy",       // "policy" | "claim" | "news"  
    "recipient": "alice",   // recipient’s username  
    "data": {               // subtype-specific fields  
      // ── policy example:  
      "policy_id": 42,  
      "subject": "Policy Update",  
      "body": "Your plan has changed.",  
      "is_read": false,  
      "is_archived": false  
  }
}
```

**Success Response (200)**
```json
{
  "message": "Creation successful",
  "record": { // the created subtype record, e.g.: //
    "id": 7,
    "notif_id": 123,
    // …other fields… //
  }
}
```

**Errors**

- `400`: missing/invalid type | recipient | data

- `403`: sender ≠ route param

- `400/500`: Prisma errors

<br>
<br>

## **2. Soft‑Delete Notification**
### **DELETE /api/deletenotif/{userId}/{notifId}**

Marks an existing notification’s is_active → false.

**Route Params**

- `userId` (string) – notification.sender

- `notifId` (string → int)

<br>

**No request body needed.**

<br>

**Success (200)**
 
```json
{
  "message": "Delete successful",
  "record": {
    "id": 123,
    "sender": "alice",
    "recipient": "bob",
    "is_active": false,
    /* …other notification fields… */
  }
}
```

**Errors**

- `403`: sender ≠ userId

- `500`: unexpected server error

<br>
<br>

## **3. Edit Notification Subtype**
### **PATCH /api/editnotif/{userId}/{notifId}**
Updates fields on the chosen notification subtype.

**Route Params**

- `userId` (string)

- `notifId` (string → int)

**Request Body**

```json
{
  "type": "policy",   // which subtype to update
  "edits": {          // only allowed fields for that subtype
    "subject": "New Subject",
    "is_read": true
  }
}
```

**Success (200)**

```json
{
  "message": "Edit successful",
  "record": { /* updated subtype record */ }
}
```

**Errors**


- `400`: missing/invalid type | edits

- `403`: access forbidden

- `400/500`: Prisma errors
<br>
<br>

## **4. List All Notifications by Type**
### **POST /api/getallnotifs/{userId}**

Fetches all subtype records for userId, optionally filtered.

**Route Params**

- `userId` (string)

**Request Body (optional filters)**

```json
{
  "type": "claim",      // restrict to one subtype
  "is_flagged": true    // filter notifications where notifications.is_flagged == true
}
```

**Success (200)**

```json
[
  {
    "id": 5,
    "notif_id": 123,
    /* …fields from policy_notifs or claim_notifs or news_notifs… */
    "Notification": {
      "sender": "alice",
      "recipient": "alice",
      /* …parent notification fields… */
    }
  },
  /* …more records… */
]
```

**Errors**

- `400`: missing userId or invalid filters

- `403`: access forbidden

- `400/500`: Prisma errors

<br>
<br> 

## **5. Get Single Notification**
### **GET /api/getnotif/{userId}/{notifId}**

Retrieves one notification (with its subtype) for a user.

**Route Params**


- `userId` (string)

- `notifId` (string → int)

**No request body.**


**Success (200)**

```json

{
  "id": 123,
  "sender": "alice",
  "recipient": "bob",
  "is_active": true,
  "is_flagged": false,
  "PolicyNotif": { /* or ClaimNotif or NewsNotif */ }
}
```

**Errors**

- `404` : Notification not found

<br>
<br>

## **6. User Login**
### **POST /api/login**

Authenticates by username & password.

**Request Body**

```json
{ "username": "alice", "password": "secret" }
```

**Success (200)**

```json
{
  "username": "alice",
  "first_name": "Alice",
  "last_name": "Smith",
  /* …other user fields (no password)… */
}
```

**Errors**

- `400`: missing credentials

- `401`: invalid credentials

- `500`: internal error
<br>
<br>

## **7. User Signup**
### **POST /api/signup**

Creates a new user account.

**Request Body**


```json

{
  "username": "alice",
  "first_name": "Alice",
  "last_name": "Smith",
  "password": "secret",
  "usertype": 2
}
```

**Success (201)**

```json
{
  "username": "alice",
  "first_name": "Alice",
  "last_name": "Smith",
  "user_type_id": 2,
  "created_at": "2025-04-20T15:00:00.000Z"
}
```

**Errors**

- `400`: missing/invalid fields

- `409`: username taken

- `500`: internal error

