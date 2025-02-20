// src/appwrite.js
import { Client, Account, Databases,ID } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')  // Your Appwrite API endpoint
  .setProject('67b226bf002daa150854');  // Replace with your Appwrite Project ID

// Initialize Appwrite Account (for authentication)
const account = new Account(client);

// Initialize Appwrite Databases
const databases = new Databases(client);

export { account, databases ,ID};
