import React, { useState, useEffect } from 'react';
import { db, auth } from '../../services/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import s from './AddCard.module.css';

export default function AddCard() {
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [telegram, setTelegram] = useState('');
  const [vk, setVk] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    age: '',
    avatar: '',
    education: '',
    experience: ''
  });
  const [visibleDays, setVisibleDays] = useState({});
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  // Общие предметы для ЕГЭ и ОГЭ
  const commonSubjects = [
    'Математика', 
    'Русский язык', 
    'История', 
    'Физика', 
    'Химия', 
    'Биология', 
    'География', 
    'Литература', 
    'Иностранный язык'
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = collection(db, 'users');
          const q = query(userRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserData({
                name: userData.name,
                surname: userData.surname,
                age: userData.age,
                avatar: userData.avatar,
                education: userData.education,
                experience: userData.experience
              });
            });
          }
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
        }
      }
      setUserLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', price: '', duration: '', examType: '', subjectNumber: subjects.length + 1 }]); // Нумерация услуг
  };

  const deleteSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleExamTypeChange = (index, examType) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].examType = examType;
    setSubjects(updatedSubjects);
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value
      }
    });
  };

  const toggleDayVisibility = (day) => {
    setVisibleDays({
      ...visibleDays,
      [day]: !visibleDays[day]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLoaded) {
      alert('Загрузка данных пользователя...');
      return;
    }
  
    // Если уже идет отправка, не отправляем форму снова
    if (isSubmitting) return;
  
    setIsSubmitting(true); // Устанавливаем статус отправки в true
  
    try {
      await addDoc(collection(db, 'tutors'), {
        userId: auth.currentUser.uid,
        name: `${userData.name} ${userData.surname}`,
        age: userData.age,
        avatar: userData.avatar,
        education: userData.education || '',
        experience: userData.experience || '',
        cardTitle,
        cardDescription,
        telegram,
        vk,
        subjects,
        schedule,
        createdAt: new Date(),
        status: 'Проверка модератором', // Добавляем статус
      });
  
      alert('Карточка добавлена, ожидает проверки модератором!');
    } catch (error) {
      console.error('Ошибка при добавлении карточки: ', error);
      alert('Ошибка при добавлении карточки');
    } finally {
      setIsSubmitting(false); // Возвращаем статус отправки в false после завершения
    }
  };
  

  return (
    <div className={s.formContainer}>
      <p className={s.formContainerTitle}>Добавить карточку репетитора</p>
      <form onSubmit={handleSubmit} className={s.form}>
        <label>Название карточки</label>
        <input placeholder='Название' type="text" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} required />

        <label>Описание карточки</label>
        <textarea placeholder='Описание' value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} maxLength="150" required />

        {subjects.map((subject, index) => (
          <div key={index} className={s.subjectItem}>
            <label>Экзамен</label>
            <select
              value={subject.examType}
              onChange={(e) => handleExamTypeChange(index, e.target.value)}
            >
              <option value="">Выберите экзамен</option>
              <option value="ЕГЭ">ЕГЭ</option>
              <option value="ОГЭ">ОГЭ</option>
            </select>

            <label>Предмет</label>
            <select
              value={subject.name}
              onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
              required
            >
              <option value="">Выберите предмет</option>
              {commonSubjects.map((subjectName, idx) => (
                <option key={idx} value={subjectName}>{subjectName}</option>
              ))}
            </select>

            <label>Цена за занятие</label>
            <input
              type="number"
              value={subject.price}
              onChange={(e) => handleSubjectChange(index, 'price', e.target.value)}
              required
            />

            <label>Длительность занятия (минуты)</label>
            <input
              type="number"
              value={subject.duration}
              onChange={(e) => handleSubjectChange(index, 'duration', e.target.value)}
              required
            />

            <button type="button" onClick={() => deleteSubject(index)} className={s.deleteSubject}>Удалить предмет</button>
          </div>
        ))}
        <button type="button" onClick={addSubject}>Добавить услугу</button>

        <p className={s.titleBlock}>Рабочий график</p>
        <div className={s.scheduleWrapper}>
          {daysOfWeek.map((day) => (
            <div key={day} className={s.scheduleItem}>
              <button type="button" onClick={() => toggleDayVisibility(day)} className={s.dayButton}>{day}</button>
              {visibleDays[day] && (
                <div className={s.scheduleInputs}>
                  <input
                    type="time"
                    value={schedule[day]?.from || ''}
                    onChange={(e) => handleScheduleChange(day, 'from', e.target.value)}
                  />
                  <input
                    type="time"
                    value={schedule[day]?.to || ''}
                    onChange={(e) => handleScheduleChange(day, 'to', e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={s.connection}>
          <p className={s.titleBlock}>Связь</p>
          <label>Telegram</label>
          <input type="text" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" />

          <label>VK</label>
          <input type="text" value={vk} onChange={(e) => setVk(e.target.value)} placeholder="https://vk.com/id" />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Добавление...' : 'Добавить карточку'}
        </button>
      </form>
    </div>
  );
}
