import { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import s from './Profile.module.css';
import defaultAvatar from './img/avatar.jpg';
import tg from './img/icons8-телеграм-750.png';
import vk from './img/icons8-vk-750.png';
import back from './img/back.jpg';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export default function Profile() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ totalClasses: 0, averageExamScore: 0, rating: 0, completedTests: 0 });
  const statLabels = {
    totalClasses: "Всего занятий",
    averageExamScore: "Средний балл за экзамен",
    rating: "Рейтинг",
    completedTests: "Пройдено тестов",
    students: "Всего учеников",
    totalLessons: "Количество проведенных занятий"
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    if (uid) {
      const getUserData = async () => {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser(userData);
          setDescription(userData.description || '');
          setBackground(userData.background || '');
          setName(userData.name || '');
          setSurname(userData.surname || '');
          setStats(userData.stats || { totalClasses: 0, averageExamScore: 0, rating: 0, completedTests: 0 });
        }
        setLoading(false);
      };
      getUserData();
    }

    return () => unsubscribeAuth();
  }, [uid]);

  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const fileRef = ref(storage, `backgrounds/${file.name}`);
      try {
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setBackground(url);
        if (user && uid) {
          await updateDoc(doc(db, 'users', uid), { background: url });
        }
      } catch (error) {
        console.error("Ошибка загрузки файла:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const fileRef = ref(storage, `avatars/${file.name}`);
      try {
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        // Обновление состояния user с новым аватаром
        setUser((prevUser) => ({ ...prevUser, avatar: url }));
        if (user && uid) {
          await updateDoc(doc(db, 'users', uid), { avatar: url }); // Сохранение в Firestore
        }
      } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  

  const handleSaveProfile = async () => {
    if (user && uid) {
      try {
        await updateDoc(doc(db, 'users', uid), { description, background, name, surname });
        setIsEditing(false);
      } catch (error) {
        console.error("Ошибка обновления данных:", error);
      }
    }
  };

  if (loading) return <p>Загрузка...</p>;

  const canEdit = currentUser && currentUser.uid === uid;

  return (
    <div className={s.profile}>
      <div className={s.up}>
        <img src={isUploading ? back : background || back} alt="Задний фон" className={s.background} />
        {canEdit && !isEditing && (
          <button onClick={() => setIsEditing(true)} className={s.editBtn}>Редактировать профиль</button>
        )}
        <img src={user?.avatar || defaultAvatar} alt="Аватар" className={s.avatar} />
        </div>

      {isEditing ? (
  <div className={s.editForm}>
    <div>
      <label htmlFor="name" className={s.label}>Имя</label>
      <input 
        type="text" 
        id="name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className={s.nameInput}
      />
    </div>
    <div>
      <label htmlFor="surname" className={s.label}>Фамилия</label>
      <input 
        type="text" 
        id="surname" 
        value={surname} 
        onChange={(e) => setSurname(e.target.value)} 
        className={s.surnameInput}
      />
    </div>
    <div>
      <label htmlFor="description" className={s.label}>Описание</label>
      <input 
        id="description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className={s.descriptionInput}
      />
    </div>
    <div>
      <label htmlFor="avatar" className={s.label}>Загрузить аватар</label>
      <input 
        type="file" 
        id="avatar" 
        onChange={handleAvatarChange} 
        className={s.backgroundInput}
      />
    </div>
    <div>
      <label htmlFor="background" className={s.label}>Загрузить фон</label>
      <input 
        type="file" 
        id="background" 
        onChange={handleBackgroundChange} 
        className={s.backgroundInput}
      />
    </div>
    <button 
      onClick={handleSaveProfile} 
      className={s.saveBtn} 
      disabled={isUploading}
    >
      {isUploading ? 'Загрузка...' : 'Сохранить'}  
    </button>
  </div>
      ) : (
        <div>
          <p className={s.name}>{name} {surname}</p>
          <p className={s.desc}>{description}</p>
        </div>
      )}



      <div className={s.stats}>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className={s.statItem}>
            <p className={s.statTitle}>{statLabels[key] || key}</p>
            <p className={s.statValue}>{value}</p>
          </div>
        ))}
      </div>
      
      <p className={s.devNote}>В разработке, функции скоро появятся</p>
    </div>
  );
}