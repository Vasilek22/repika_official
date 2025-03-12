// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Импортируем контекст для получения роли пользователя

const PrivateRoute = ({ allowedRoles, element }) => {
  const { role } = useAuth();  // Получаем роль из контекста

  if (!role || !allowedRoles.includes(role)) {
    // Если у пользователя нет нужной роли, редиректим на главную страницу или другую страницу
    return <Navigate to="/" />;
  }

  // Если роль подходит, рендерим переданный элемент
  return element;
};

export default PrivateRoute;
