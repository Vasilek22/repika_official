import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase'; // Импортируем Firebase для получения данных
import { collection, getDocs } from 'firebase/firestore';
import s from './Header.module.css'; // Стили для компонента
import DonationCard from '../DonationCard/DonationCard';

export default function Header() {
  const [userCount, setUserCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления открытием модального окна

  useEffect(() => {
    // Функция для получения количества пользователей
    const fetchUserCount = async () => {
      try {
        const usersRef = collection(db, 'users'); // Предполагаем, что пользователи хранятся в коллекции 'users'
        const querySnapshot = await getDocs(usersRef);
        setUserCount(querySnapshot.size); // Получаем количество документов в коллекции
      } catch (error) {
        console.error('Ошибка при получении количества пользователей:', error);
      }
    };

    fetchUserCount();
  }, []);

  const handleDonateClick = () => {
    setIsModalOpen(true); // Открываем модальное окно при нажатии на кнопку "Пожертвовать"
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };

  return (
    <header className={s.header}>
      {/* Логотип */}
      <div className={s.logo}>
        <p>Репика</p>
      </div>

      {/* Количество зарегистрированных пользователей */}
      <div className={s.userCount}>
        <p>Всего: {userCount} человек</p>
      </div>

      {/* Кнопка пожертвовать */}
      <div className={s.donateButton}>
        <p onClick={handleDonateClick} className={s.donateBtn}>
          Пожертвовать
        </p>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className={s.modal}>
          <div className={s.modalContent}>
            <svg className={s.closeBtn} onClick={handleCloseModal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
              <DonationCard/>
          </div>
        </div>
      )}
    </header>
  );
}
