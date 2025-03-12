import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database'; 
import s from './TutorCard.module.css';
import back from './back.png';

export default function TutorCard({ tutor }) {
  const {
    avatar,
    name,
    age,
    cardTitle,
    cardDescription,
    education,
    experience,
    subjects,
    tutorId,
    examType,
    telegram,  
    vk,
    schedule = {}, // Используем дефолтное значение пустого объекта для schedule
  } = tutor;

  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна


  // Функция для получения имени и фамилии пользователя
  const fetchUserName = async () => {
    if (!currentUser) return;
    
    const db = getDatabase();
    const userRef = ref(db, 'users/' + currentUser.uid); 
    const userSnapshot = await get(userRef);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      setUserName(userData.name + ' ' + userData.surname);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, [currentUser]);

  const startChat = async () => {
    if (!currentUser) {
      alert("Пожалуйста, войдите в систему.");
      return;
    }

    if (!tutorId) {
      alert("Не удалось найти идентификатор репетитора.");
      return;
    }

    if (!userName) {
      console.log('UserName is empty!');
    }

    const db = getDatabase();
    const chatId = `${currentUser.uid}_${tutorId}`;

    const chatRef = ref(db, 'chats/' + chatId);
    const chatSnapshot = await get(chatRef);

    if (!chatSnapshot.exists()) {
      await set(chatRef, {
        participants: {
          [currentUser.uid]: true,
          [tutorId]: true,
        },
        messages: {},
        userNames: {
          [currentUser.uid]: userName,
          [tutorId]: name,
        }
      });
      console.log('Chat created successfully');
    }

    navigate(`/dialogues/${chatId}`);
  };

    // Открыть модальное окно
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    // Закрыть модальное окно
    const closeModal = () => {
      setIsModalOpen(false);
    };


// Функция для форматирования расписания, выводим только дни с расписанием
const renderSchedule = () => {
  if (Object.keys(schedule).length === 0) {
      return <p className={s.noSubjects}>Нет доступных дней с расписанием.</p>;
  }
  
  return (
      <div className={s.scheduleContainer}>
          {Object.keys(schedule).map((day) => {
              const daySchedule = schedule[day];
              return (
                  <div key={day} className={s.scheduleItem}>
                      <span className={s.scheduleDay}>{day}</span>
                      <span className={s.scheduleTime}>{daySchedule.from} - {daySchedule.to}</span>
                  </div>
              );
          })}
      </div>
  );
};


  return (
    <div className={s.courseCard}>
      <div className={s.courseCardUp}>
        <img src={avatar || "./avatar.jpg"} alt="Аватар" className={s.courseCardAvatar} />
        <div className={s.courseInfo}>
          <p className={s.courseInstructor}>{name} ({age} лет)</p>
          <p className={s.courseExperience}>Опыт работы: {experience} года</p>
          <p className={s.courseEducation}>Образование: {education}</p>
          {/*<p className={s.courseRating}>Рейтинг: 4.5 (138 отзывов)</p>*/}
        </div>
      </div>
      <div className={s.courseCardDesc}>
        <h3 className={s.courseTitle}>{cardTitle}</h3>
        <p className={s.courseDescription}>{cardDescription}</p>
        <p className={s.titleSchedule} >Услуги</p>
        <p className={s.courseDetails}>
          {subjects && subjects.length > 0 ? (
            <ul className={s.subjectList}>
              {subjects.map((subject, index) => (
                <li key={index} className={s.subjectItem}>
                  <span className={s.subjectExamType}>{subject.examType}</span>
                  <span className={s.subjectName}>{subject.name}</span>
                  <span className={s.subjectDetails}>
                    {subject.price}₽  / {subject.duration}мин
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.noSubjects}>Нет доступных предметов.</p>
          )}
        </p>

        <p className={s.titleSchedule} >График работы</p>
        {renderSchedule()}

      </div>
        <p className={s.btnBuy} onClick={openModal}>Связь с репетитором</p>
      {isModalOpen && (
        <div className={s.modal}>
          <div className={s.modalContent}>
              <svg className={s.closeBtn} onClick={closeModal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            <p className={s.modalContentTitle}>Связь с репетитором</p>
            <p><strong>Telegram:</strong> {telegram}</p>
            <p><strong>VK:</strong> {vk}</p>
          </div>
        </div>
      )}
    </div>
  );
}
