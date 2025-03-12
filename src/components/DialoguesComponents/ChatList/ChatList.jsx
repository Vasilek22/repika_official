import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; // Для перенаправления
import { getAuth } from 'firebase/auth';
import s from './ChatList.module.css';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const chatsRef = ref(db, 'chats');

      // Слушаем изменения в чатах
      onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();
        const userChats = [];

        // Фильтруем чаты, чтобы показать только те, где текущий пользователь является участником
        for (const chatId in data) {
          const chat = data[chatId];
          if (chat.participants[currentUser.uid]) {
            userChats.push({ id: chatId, ...chat });
          }
        }

        setChats(userChats); // Обновляем состояние с полученными чатами
      });
    }
  }, [currentUser]);

  const openChat = (chatId) => {
    // Перенаправляем в комнату чата
    navigate(`/dialogues/${chatId}`);
  };

  return (
    <div className={s.chatListContainer}>
      <h2 className={s.chatListTitle}>Ваши чаты</h2>
      <div className={s.chatList}>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={s.chatItem}
              onClick={() => openChat(chat.id)} // При клике переходим в чат
            >
              <p className={s.chatName}>
                Репетитор: {chat.participants[chat.id] || 'Неизвестно'}
              </p>
              <p className={s.chatLastMessage}>
                {chat.messages && chat.messages.length > 0
                  ? chat.messages[chat.messages.length - 1]?.text || 'Нет сообщений'
                  : 'Нет сообщений'}
              </p>
              <p className={s.chatDate}>{chat.date}</p>
            </div>
          ))
        ) : (
          <p>У вас нет чатов.</p>
        )}
      </div>
    </div>
  );
}
