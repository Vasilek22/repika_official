import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../services/firebase';  // Добавьте подключение к Firestore
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';  // Импорт для получения данных из Firestore

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);  // Добавлено состояние для роли пользователя

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);  // Путь к документу пользователя в Firestore
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setCurrentUser(user);
          setRole(docSnap.data().role);  // Предполагается, что роль хранится в поле 'role'
        }
      } else {
        setCurrentUser(null);
        setRole(null);  // Если нет пользователя, роль тоже сбрасывается
      }

      setLoading(false);  // Завершаем процесс загрузки
    });

    return unsubscribe;  // Очищаем подписку при размонтировании компонента
  }, []);

  const value = {
    currentUser,
    role,  // Добавлено поле для роли
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
