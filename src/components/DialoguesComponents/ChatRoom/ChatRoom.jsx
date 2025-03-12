import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, push, serverTimestamp } from 'firebase/database';
import { useParams } from 'react-router-dom';
import s from './ChatRoom.module.css';
const ChatRoom = () => {
    const { chatId } = useParams(); // Получаем chatId из URL
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [messages, setMessages] = useState([]); // Состояние для хранения сообщений
    const [newMessage, setNewMessage] = useState(''); // Состояние для нового сообщения
  
    // Получение сообщений и участников из Firebase
    useEffect(() => {
      const db = getDatabase();
      const messagesRef = ref(db, `chats/${chatId}/messages`);
  
      // Получаем сообщения
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedMessages = [];
        for (const key in data) {
          loadedMessages.push(data[key]);
        }
        setMessages(loadedMessages); // Загружаем сообщения в состояние
      });
    }, [chatId]);
  
    // Отправка сообщения в Firebase
    const handleSendMessage = async () => {
      if (newMessage.trim()) {
        const db = getDatabase();
        const messagesRef = ref(db, `chats/${chatId}/messages`);
        await push(messagesRef, {
          senderId: currentUser.uid,
          senderName: currentUser.displayName || 'Неизвестный', // Добавляем имя пользователя
          message: newMessage,
          timestamp: serverTimestamp(),
        });
        setNewMessage(''); // Очищаем поле ввода после отправки
      }
    };
  
    return (
      <div className={s.chatContainer}>
        <div className={s.messagesContainer}>
          {messages.map((message, index) => (
            <div key={index} className={s.messageContainer}>
              <p className={s.messageSender}>
                {message.senderName || 'Неизвестный'} {/* Используем имя отправителя из сообщения */}
              </p>
              <p className={s.messageContent}>{message.message}</p>
              <p className={s.messageTime}>{new Date(message.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
        <div className={s.inputContainer}>
          <input
            type="text"
            className={s.inputField}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение"
          />
          <button className={s.sendButton} onClick={handleSendMessage}>
            Отправить
          </button>
        </div>
      </div>
    );
  };
  
  export default ChatRoom;
  
