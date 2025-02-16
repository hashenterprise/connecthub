import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { Clerk } from '@clerk/clerk-sdk-node';
import clientPromise from '@/lib/mongodb';

const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('chatapp');
    const contactsCollection = db.collection('contacts');

    if (req.method === 'GET') {
      const { userId } = req.query;
      const contacts = await contactsCollection
        .find({ userId: userId })
        .toArray();
      return res.status(200).json(contacts);
    }

    if (req.method === 'POST') {
      const { userId, contactData } = req.body;
      
      // Verify user exists in Clerk
      await clerk.users.getUser(userId);
      
      const newContact = {
        userId,
        ...contactData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        online: false,
        lastMessage: null
      };
      
      await contactsCollection.insertOne(newContact);
      return res.status(200).json(newContact);
    }
  } catch (error) {
    console.error('Error managing contacts:', error);
    return res.status(500).json({ message: 'Error managing contacts' });
  }
}