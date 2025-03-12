import React, { useState } from 'react';
import { auth, db, storage } from '../services/firebase'; // Подключение Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import s from './RegTutor.module.css';
import { useNavigate } from 'react-router-dom';

export default function RegTutor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    age: '',
    education: '',
    experience: '',
    phone: '',
    email: '',
    password: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const userId = userCredential.user.uid;

      let avatarUrl = '';
      if (form.avatar) {
        const avatarRef = ref(storage, `avatars/${userId}`);
        await uploadBytes(avatarRef, form.avatar);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      await setDoc(doc(db, 'users', userId), {
        userId,
        name: form.name,
        surname: form.surname,
        age: form.age,
        education: form.education,
        experience: form.experience,
        phone: form.phone,
        email: form.email,
        avatar: avatarUrl,
        role: 'tutor',
        stats: {
          totalLessons: 0,
          averageExamScore: 0,
          rating: 0,
          students: 0,
        }
      });
      navigate('/');
      alert('Регистрация успешна!');
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className={s.registerContent}>
      <div className={s.registerWrapper}>
        <button className={s.btnBack} onClick={() => navigate(-1)}>Назад</button>
        <p className={s.title}>Регистрация репетитора</p>
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <label className={s.inputLabel}>Имя</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Имя'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Фамилия</label>
            <input
              type="text"
              name="surname"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Фамилию'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Возраст</label>
            <input
              type="number"
              name="age"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Возраст'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Образование</label>
            <input
              type="text"
              name="education"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Образование'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Опыт работы</label>
            <input
              type="text"
              name="experience"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Опыт работы'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Телефон</label>
            <input
              type="tel"
              name="phone"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Телефон'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Email'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Пароль</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className={s.input}
              placeholder='Введите Пароль'
            />
          </div>
          <div className={s.field}>
            <label className={s.inputLabel}>Аватар</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={s.input}
            />
          </div>
          <button className={s.btnReg} type="submit" disabled={loading}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</button>
        </form>
      </div>
    </div>
  );
}