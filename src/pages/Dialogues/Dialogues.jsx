import React from 'react';
import s from './Dialogues.module.css';
import ChatList from '../../components/DialoguesComponents/ChatList/ChatList';
import ChatRoom from '../../components/DialoguesComponents/ChatRoom/ChatRoom';
import { useParams } from 'react-router-dom';

export default function Dialogues() {
  const { chatId } = useParams();

  return (
    <div className={s.dialoguesContainer}>
      <div className={s.chatListContainer}>
        <ChatList /> {/* Список чатов остается видимым */}
      </div>
      <div className={s.chatRoomContainer}>
        {chatId ? <ChatRoom chatId={chatId} /> : <p>Выберите чат</p>} {/* Если chatId есть, показываем ChatRoom */}
      </div>
    </div>
  );
}
