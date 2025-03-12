import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';  // для редиректа, если пользователь не авторизован

export default function AuthCheck({ children }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // Если пользователь авторизован, сохраняем его в состоянии
      } else {
        setUser(null);  // Если нет, обнуляем состояние
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (user === null) {
    // Если пользователь не авторизован, можем перенаправить на страницу входа
    return <Navigate to="/login" />;  // или показываем что-то, например, сообщение
  }

  return children;  // Если пользователь авторизован, показываем дочерние элементы
}
