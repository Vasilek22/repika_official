import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import s from './ManageCards.module.css';

export default function ManageCards() {
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [telegram, setTelegram] = useState('');
  const [vk, setVk] = useState('');
  const [schedule, setSchedule] = useState([]); // Для хранения расписания
  const [subjects, setSubjects] = useState([]); // Для хранения списка предметов

  // Массивы для выпадающих списков
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const commonSubjects = [
    'Математика', 
    'Русский язык', 
    'История', 
    'Физика', 
    'Химия', 
    'Биология', 
    'География', 
    'Литература', 
    'Иностранный язык',
    'Обществознание',
    'Информатика'
  ];
  const examTypes = ['ЕГЭ', 'ОГЭ'];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.log('Пользователь не авторизован');
          return;
        }
  
        const cardsRef = collection(db, 'tutors');
        const q = query(cardsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
  
        const cardsData = querySnapshot.docs.map(doc => {
          const card = { id: doc.id, ...doc.data() };
          // Обрабатываем расписание, чтобы оно всегда было массивом
          card.schedule = Array.isArray(card.schedule) ? card.schedule : [];
          card.subjects = Array.isArray(card.subjects) ? card.subjects : [];
          return card;
        });
        setCards(cardsData);
        
      } catch (error) {
        console.error('Ошибка при получении карточек:', error);
      }
    };
    fetchCards();
  }, []);  // Запрашиваем карточки только при загрузке компонента
  

  const startEditing = (card) => {
    setEditingCard(card);
    setCardTitle(card.cardTitle);
    setCardDescription(card.cardDescription);
    setTelegram(card.telegram);
    setVk(card.vk);
  
    // Проверяем, чтобы schedule всегда был массивом
    setSchedule(Array.isArray(card.schedule) ? card.schedule : []); // Если schedule существует и является массивом, загружаем его, иначе - пустой массив
    setSubjects(card.subjects || []);  // Если предметы существуют, загружаем их
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    if (!editingCard) return;
  
    try {
      const cardRef = doc(db, 'tutors', editingCard.id);
  
      // Обновляем карточку и устанавливаем статус "Проверка модератором"
      await updateDoc(cardRef, {
        cardTitle,
        cardDescription,
        telegram,
        vk,
        schedule,  // Добавляем расписание
        subjects,  // Добавляем предметы
        status: 'Проверка модератором'  // Устанавливаем статус
      });
  
      alert('Карточка обновлена и поставлена на проверку модератором!');
      setEditingCard(null); // Закрываем режим редактирования
    } catch (error) {
      console.error('Ошибка при обновлении карточки:', error);
      alert('Ошибка при обновлении карточки');
    }
  };
  

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', examType: '', duration: '', price: '', subjectNumber: subjects.length + 1 }]);
  };

  const handleChangeSubject = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: '', from: '', to: '' }]);
  };

  const handleChangeSchedule = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  return (
    <div className={s.container}>
      {editingCard ? (
        <div className={s.editForm}>
          <h3 className={s.editFormTitle}>Редактировать карточку</h3>
          <form onSubmit={handleUpdateCard} className={s.form}>
            <label className={s.label}>Название карточки</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              required
              className={s.input}
            />

            <label className={s.label}>Описание карточки</label>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              maxLength="150"
              required
              className={s.textarea}
            />

            <label className={s.label}>Telegram</label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={s.input}
            />

            <label className={s.label}>VK</label>
            <input
              type="text"
              value={vk}
              onChange={(e) => setVk(e.target.value)}
              className={s.input}
            />

            {/* Расписание */}
            <h4 className={s.scheduleTitle}>Расписание</h4>
            {schedule.map((item, index) => (
              <div key={index} className={s.scheduleItem}>
                <label className={s.label}>День</label>
                <select
                  value={item.day}
                  onChange={(e) => handleChangeSchedule(index, 'day', e.target.value)}
                  className={s.input}
                >
                  <option value="">Выберите день</option>
                  {daysOfWeek.map((day, idx) => (
                    <option key={idx} value={day}>{day}</option>
                  ))}
                </select>

                <label className={s.label}>Время с</label>
                <input
                  type="time"
                  value={item.from || ''} 
                  onChange={(e) => handleChangeSchedule(index, 'from', e.target.value)}
                  className={s.input}
                />

                <label className={s.label}>Время по</label>
                <input
                  type="time"
                  value={item.to || ''} 
                  onChange={(e) => handleChangeSchedule(index, 'to', e.target.value)}
                  className={s.input}
                />
              </div>
            ))}


            <button type="button" onClick={handleAddSchedule} className={s.addButton}>Добавить время</button>

            {/* Список предметов */}
            <h4 className={s.subjectsTitle}>Предметы</h4>
            {Array.isArray(subjects) && subjects.map((subject, index) => (
              <div key={index} className={s.subjectItem}>
                <label className={s.label}>Название предмета</label>
                <select
                  value={subject.name}
                  onChange={(e) => handleChangeSubject(index, 'name', e.target.value)}
                  className={s.input}
                >
                  <option value="">Выберите предмет</option>
                  {commonSubjects.map((subjectName, idx) => (
                    <option key={idx} value={subjectName}>{subjectName}</option>
                  ))}
                </select>

                <label className={s.label}>Тип экзамена</label>
                <select
                  value={subject.examType}
                  onChange={(e) => handleChangeSubject(index, 'examType', e.target.value)}
                  className={s.input}
                >
                  <option value="">Выберите тип экзамена</option>
                  {examTypes.map((examType, idx) => (
                    <option key={idx} value={examType}>{examType}</option>
                  ))}
                </select>

                <label className={s.label}>Продолжительность (мин)</label>
                <input
                  type="number"
                  value={subject.duration}
                  onChange={(e) => handleChangeSubject(index, 'duration', e.target.value)}
                  className={s.input}
                />

                <label className={s.label}>Цена</label>
                <input
                  type="text"
                  value={subject.price}
                  onChange={(e) => handleChangeSubject(index, 'price', e.target.value)}
                  className={s.input}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddSubject} className={s.addButton}>Добавить предмет</button>

            <div className={s.buttons}>
              <button type="submit" className={s.submitButton}>Обновить карточку</button>
              <button type="button" onClick={() => setEditingCard(null)} className={s.cancelButton}>Отменить</button>
            </div>
          </form>
        </div>
      ) : (
        <div className={s.cardList}>
          <h3 className={s.cardListTitle}>Список карточек</h3>
          {cards.length === 0 ? (
            <p className={s.noCardsMessage}>Нет карточек для отображения.</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} className={s.card}>
                <h4 className={s.cardTitle}>{card.cardTitle}</h4>
                <p className={s.cardDescription}>{card.cardDescription}</p>
                <p className={s.cardContact}>Telegram: {card.telegram}</p>
                <p className={s.cardContact}>VK: {card.vk}</p>
                <button onClick={() => startEditing(card)} className={s.editButton}>Редактировать</button>
                <p className={s.cardStatus}>Статус: {card.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
