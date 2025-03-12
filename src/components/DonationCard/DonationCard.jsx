import React, { useState } from "react";
import styles from "./DonationCard.module.css"; // Импортируем стили

export default function DonationCard() {
  const [copied, setCopied] = useState(false); // Состояние для отслеживания, скопирован ли номер

  const handleCopy = () => {
    navigator.clipboard.writeText("2200 7017 3198 3802") // Копируем номер карты в буфер
      .then(() => {
        setCopied(true); // Показываем сообщение о копировании
        setTimeout(() => setCopied(false), 2000); // Через 2 секунды скрываем сообщение
      })
      .catch((err) => console.error("Ошибка при копировании: ", err));
  };

  return (
    <div className={styles.donationCard}>
      <h2 className={styles.donationTitle}>Поддержите платформу</h2>
      <p className={styles.donationText}>
        Ваш вклад поможет нам развивать проект и улучшать сервис.
      </p>
      <div className={styles.cardNumber} onClick={handleCopy}>
        2200 7017 3198 3802
      </div>
      <p className={styles.cardInfo}>Это номер карты Тинькофф</p> {/* Добавлен текст с информацией о карте */}
      {copied && <p className={styles.copiedMessage}>Номер карты скопирован!</p>} {/* Сообщение, если номер скопирован */}
    </div>
  );
}
