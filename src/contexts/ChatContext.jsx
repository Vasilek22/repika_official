// src/contexts/ChatContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ChatService } from '../services/chat';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [currentChat, setCurrentChat] = useState(null);
// src/contexts/ChatContext.js
    const [messages, setMessages] = useState([]);


  // Fetch messages whenever currentChat changes and has a valid id
  useEffect(() => {
    if (currentChat?.id) {
      const unsubscribe = ChatService.subscribeToMessages(
        currentChat.id,
        setMessages
      );
      return () => unsubscribe(); // Cleanup subscription on unmount or when currentChat changes
    }
  }, [currentChat]); // Only re-run effect when currentChat changes

  const value = {
    currentChat,
    setCurrentChat,
    messages,
    sendMessage: (message) => ChatService.sendMessage(currentChat?.id, message)
    };


  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
