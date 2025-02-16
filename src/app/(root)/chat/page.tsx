'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { useSocket } from '@/hooks/use-socket';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button, Input, ScrollArea } from '@/components/ui';
import { UserPlus, Mail, Hash, Search, Phone, Video, MoreVertical, Send } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  lastMessage?: string;
  online?: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
}

const ChatPage = () => {
  const { session, user } = useAuth();
  const { addToast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newContact, setNewContact] = useState({ name: '', email: '', phoneNumber: '' });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const socket = useSocket();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: session?.user?.id || '',
      receiverId: selectedContact?.id || '',
      createdAt: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage('');

    // Send the message to the server
    socket?.emit('sendMessage', newMsg);
  };

  const addContact = async () => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) throw new Error('Failed to add contact');

      const savedContact = await response.json();
      setContacts(prev => [...prev, savedContact]);
      setNewContact({ name: '', email: '', phoneNumber: '' });
      
      addToast({
        title: "Success",
        description: "Contact added successfully",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Contacts sidebar */}
      <div className="w-80 border-r border-gray-700/50 bg-black/30 backdrop-blur-xl">
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient" />
              <div className="flex-1">
                <h2 className="font-bold text-white">Messages</h2>
                <p className="text-sm text-gray-400">Your conversations</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800/50">
                  <UserPlus className="h-5 w-5 text-blue-400" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Email address"
                      value={newContact.email}
                      onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Phone number"
                      value={newContact.phoneNumber}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <Button
                    onClick={addContact}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Add Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Enhanced Search Component */}
          <div className="mt-4 relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl transition-all duration-300 ${isSearchFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
            <div className="relative flex items-center">
              <input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 px-10 bg-gray-800/30 border-0 rounded-lg text-gray-100 placeholder-gray-400 backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isSearchFocused ? 'shadow-lg shadow-blue-500/20' : ''}`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search className={`h-4 w-4 absolute left-3 transition-all duration-300 ${isSearchFocused ? 'text-blue-400' : 'text-gray-400'}`} />
              <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 cursor-pointer hover:bg-gray-800/30 transition-all duration-300 ${selectedContact?.id === contact.id ? 'bg-gray-800/50 border-l-2 border-blue-500' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900 animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white">{contact.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-700/50 bg-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <div>
                  <h3 className="font-medium text-white">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedContact.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800/50">
                  <Phone className="h-5 w-5 text-blue-400" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800/50">
                  <Video className="h-5 w-5 text-blue-400" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800/50">
                  <MoreVertical className="h-5 w-5 text-blue-400" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${message.senderId === session?.user?.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-800/70 text-white'} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-700/50 bg-black/30 backdrop-blur-xl">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 border-gray-700/50"
              />
              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-6 transition-all duration-300 hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50">
          <div className="text-center space-y-4">
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            <p>Select a contact to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;