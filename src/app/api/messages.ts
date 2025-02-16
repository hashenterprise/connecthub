// messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('chatapp');
    const messagesCollection = db.collection('messages');

    if (req.method === 'GET') {
      const { senderId, receiverId } = req.query;
      const messages = await messagesCollection
        .find({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        })
        .sort({ createdAt: 1 })
        .toArray();
      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      const messageData = req.body;
      const newMessage = {
        ...messageData,
        createdAt: new Date().toISOString()
      };
      
      await messagesCollection.insertOne(newMessage);
      
      // Update last message in contacts
      const contactsCollection = db.collection('contacts');
      await contactsCollection.updateOne(
        { userId: messageData.senderId, 'id': messageData.receiverId },
        { $set: { lastMessage: messageData.content } }
      );
      
      return res.status(200).json(newMessage);
    }
  } catch (error) {
    console.error('Error managing messages:', error);
    return res.status(500).json({ message: 'Error managing messages' });
  }
}