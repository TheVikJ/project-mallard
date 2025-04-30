# **Setting Things Up:** #

### **1. Pull Latest Code** ###

### **2. Install Dependencies** ###
Run **npm install** in terminal
<br>

### **3. Configure Database** ###
Create/update .env file with DB_URL = "our database url"
<br>

### **4. Regenerate Prisma Client** ###
If there have been any schema changes, you will need to regenerate the Prisma client for things to work properly.
Run **npx prisma generate**
<br>

### **5. Start the Dev Server** ###
Run **npm run dev** and visit the localhost link to view our site.
<br>
<br>

# **API Endpoint Documentation:**
## **1. Create Notification**
### **POST /api/addnotif/{senderId}**
Creates a new notification (policy, claim, or news) for a single recipient.

**Route Params**

- `senderId` (string): the sender’s username.

**Request Body**
<br>

 ```json
  Example Policy Body:
{
"type": "policy",
  "recipient": "johndoe",
  "data": {
    "policy_id": 9023,
    "subject": "Policy Expiration",
    "body": "Your policy has just expired, renew now."
  },
  "is_flagged": false,
  "priority": 1
}

  Example Claims Body:
{
"type": "claim",
  "recipient": "johndoe",
  "data": {
    "policy_holder": "johndoe",
    "claimant":      "janedoe",
    "type":          "Damage Review",
    "due_date":      "2025-05-15T12:00:00.000Z",
    "business":      "Auto Insurance",
    "description":   "Review damages for claim #CLM-5678"
  },
  "is_flagged": true,
  "priority": 2
}

Example News Body:
{
"type": "news",
  "recipient": "johndoe",
  "data": {
    "title":       "Big Product Launch",
    "body":        "Our new product goes live next week!",
    "type":        "company",
    "created_on":  "2025-04-01T10:00:00.000Z",
    "expires_on":  "2025-05-01T10:00:00.000Z"
  },
  "is_flagged": false,
  "priority": 1
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
Policy Notificiaton
{
  "type": "policy",
  "edits": {
    "policy_id":   9876,
    "subject":     "New policy subject",
    "body":        "Here’s the updated body text.",
    "is_archived": true
  }
}

Claims Notification
{
  "type": "claim",
  "edits": {
    "policy_holder": "janedoe",
    "claimant":      "johndoe",
    "type":          "damage",
    "due_date":      "2025-08-15T00:00:00.000Z",
    "business":      "Auto",
    "description":   "Updated description of the claim.",
    "is_completed":  true
  }
}

News Notification
{
  "type": "news",
  "edits": {
    "title":       "Updated News Title",
    "body":        "Here’s the new body text for the news item.",
    "type":        "company update",
    "created_on":  "2025-05-01T12:00:00.000Z",
    "expires_on":  "2025-07-01T00:00:00.000Z"
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

