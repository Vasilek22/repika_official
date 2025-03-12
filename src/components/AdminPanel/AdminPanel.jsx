import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import s from './AdminPanel.module.css';
import TutorCard from '../../components/TutorCard/TutorCard';

export default function AdminPanel() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutorsCollection = collection(db, 'tutors');
        const querySnapshot = await getDocs(tutorsCollection);
        const tutorsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Фильтрация, чтобы показывать только репетиторов со статусом "В ожидании"
        const filteredTutors = tutorsList.filter(
          (tutor) => tutor.status !== 'Одобрено' && tutor.status !== 'Отклонено'
        );
        setTutors(filteredTutors);
      } catch (error) {
        console.error('Ошибка при загрузке данных репетиторов:', error);
      }
    };

    fetchTutors();
  }, []);

  const handleApprove = async (id) => {
    try {
      const tutorRef = doc(db, 'tutors', id);
      await updateDoc(tutorRef, {
        status: 'Одобрено',
      });
      setTutors((prevTutors) =>
        prevTutors.map((tutor) =>
          tutor.id === id ? { ...tutor, status: 'Одобрено' } : tutor
        )
      );
    } catch (error) {
      console.error('Ошибка при одобрении репетитора:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const tutorRef = doc(db, 'tutors', id);
      await updateDoc(tutorRef, {
        status: 'Отклонено',
      });
      setTutors((prevTutors) =>
        prevTutors.map((tutor) =>
          tutor.id === id ? { ...tutor, status: 'Отклонено' } : tutor
        )
      );
    } catch (error) {
      console.error('Ошибка при отклонении репетитора:', error);
    }
  };

  return (
    <div className={s.adminPanelContainer}>
      <h1>Админ-панель</h1>
      <div className={s.tutorsList}>
        {tutors.length === 0 ? (
          <p>Нет репетиторов для проверки</p>
        ) : (
          tutors.map((tutor) => (
            <div key={tutor.id} className={s.tutorCardContainer}>
              <TutorCard tutor={tutor} />
              <div className={s.buttonsContainer}>
                <button 
                  className={s.approveButton} 
                  onClick={() => handleApprove(tutor.id)}
                  disabled={tutor.status === 'Одобрено'}
                >
                  Одобрить
                </button>
                <button 
                  className={s.rejectButton} 
                  onClick={() => handleReject(tutor.id)}
                  disabled={tutor.status === 'Отклонено'}
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
