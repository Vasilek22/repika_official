import React, { useState, useEffect } from 'react';
import s from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import DonationCard from '../DonationCard/DonationCard';

export default function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        const userRef = doc(firestore, 'users', currentUser.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            setUser({ ...currentUser, role: docSnap.data().role });
          } else {
            setUser(currentUser);
          }
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsAuthenticated(false);
      setUser(null);
    }).catch(error => {
      console.error(error.message);
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <aside className={`${s.sidebar} ${isMenuOpen ? s.sidebarOpen : ''}`}>
      {/* Меню для мобильных устройств */}
      {!isAuthenticated && (
        <div className={s.registrationBlock}>
          <p>Вход</p>
          <Link to="/register-student" className={s.navLink}>
            <span className={s.linkText}>Ученикам</span>
          </Link>
          <Link to="/register-tutor" className={s.navLink}>
            <span className={s.linkText}>Репетиторам</span>
          </Link>
        </div>
      )}

      <ul className={`${s.menuList} ${isMenuOpen ? s.menuListOpen : ''}`}>
        {user && (
          <Link to={`/profile/${user.uid}`} className={s.menuItem}>
            <div className={s.menuIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={s.menuText}>Профиль</p>
          </Link>
        )}

        {user && user.role !== 'student' && (
          <Link to='/management' className={s.menuItem}>
            <div className={s.menuIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p className={s.menuText}>Управление</p>
          </Link>
        )}

        <Link to="/" className={s.menuItem}>
          <div className={s.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={s.menuText}>Репетиторы</p>
        </Link>

        {/* Проверка роли для отображения ссылки на админ-панель */}
        {user && user.role === 'admin' && (
          <Link to="/admin-panel" className={s.menuItem}>
            <div className={s.menuIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={s.menuText}>Админ панель</p>
          </Link>
        )}
      </ul>

      <div className={s.mobileContainer}>
        {user && user.role !== 'student' && (
          <Link to="/add-card" className={s.btnAddCard}>
            <p className={s.btnAddCardText}>Добавить карточку</p>
          </Link>
        )}

        {isAuthenticated && (
          <div onClick={handleLogout} className={s.logoutButtonBlock}>
            <p className={s.logoutButtonText}>Выйти</p>
          </div>
        )}

        <div className={s.donationCard}>
          <DonationCard/>
        </div>

        {/* Кнопка задач, видимая только на мобильных устройствах */}
        <Link to="/goals" className={s.btnGoals}>
          <p className={s.btnGoalsText}>Наши задачи</p>
        </Link>
      </div>
    </aside>
  );
}
