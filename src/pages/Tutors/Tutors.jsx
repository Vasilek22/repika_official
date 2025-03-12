import React, { useState, useEffect } from 'react'; 
import { db } from '../../services/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import s from './Tutors.module.css'; 
import TutorCard from '../../components/TutorCard/TutorCard';

import mathImg from './img/math.png'; 
import rusImg from './img/rus.png'; 
import physicsImg from './img/physics.png'; 
import chemistryImg from './img/chemistry.png'; 
import biologyImg from './img/biology.png'; 
import historyImg from './img/history.png'; 
import geographyImg from './img/geography.png'; 
import englishImg from './img/english.png'; 
import informaticsImg from './img/informatics.png'; 
import literatureImg from './img/literature.png'; 
import socialImg from './img/social.png';

export default function Tutors() { 
  const [tutors, setTutors] = useState([]); 
  const [filteredTutors, setFilteredTutors] = useState([]); 
  const [filters, setFilters] = useState({
    subjects: [],
  });

  const subjectsTwo = [
    { name: "Математика", img: mathImg },
    { name: "Русский язык", img: rusImg },
    { name: "Физика", img: physicsImg },
    { name: "Химия", img: chemistryImg },
    { name: "Биология", img: biologyImg },
    { name: "История", img: historyImg },
    { name: "География", img: geographyImg },
    { name: "Английский язык", img: englishImg },
    { name: "Информатика", img: informaticsImg },
    { name: "Литература", img: literatureImg },
    { name: "Обществознание", img: socialImg }
  ];

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutorsCollection = collection(db, 'tutors');
        const querySnapshot = await getDocs(tutorsCollection);
        const tutorsList = querySnapshot.docs.map(doc => doc.data());

        // Фильтрация по статусу "Одобрено"
        const approvedTutors = tutorsList.filter(tutor => tutor.status === 'Одобрено');
        
        setTutors(approvedTutors);
        setFilteredTutors(approvedTutors);
      } catch (error) {
        console.error('Ошибка при загрузке данных репетиторов:', error);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    filterTutors();
  }, [filters.subjects]);

  const handleSubjectClick = (subject) => {
    setFilters((prevFilters) => {
      const newSubjects = prevFilters.subjects.includes(subject)
        ? prevFilters.subjects.filter(s => s !== subject)
        : [...prevFilters.subjects, subject];
      return { ...prevFilters, subjects: newSubjects };
    });
  };

  const filterTutors = () => {
    if (filters.subjects.length === 0) {
      setFilteredTutors(tutors);
      return;
    }

    const filtered = tutors.filter((tutor) =>
      tutor.subjects.some(subj => filters.subjects.includes(subj.name))
    );
    setFilteredTutors(filtered);
  };

  return (
    <div className={s.tutorsContainer}>
      <main className={s.content}>
        <div className={s.subjectsContainer}>
          {subjectsTwo.map((subject, index) => (
            <div
              key={index}
              className={`${s.subjectCard} ${filters.subjects.includes(subject.name) ? s.active : ''}`}
              onClick={() => handleSubjectClick(subject.name)}
            >
              <p>{subject.name}</p>
              <img src={subject.img} alt={subject.name} />
            </div>
          ))}
        </div>
      </main>

      <div className={s.tutorsList}>
        {filteredTutors.length === 0 ? (
          <p>Пока что карточек нет</p> // Здесь будет выводиться текст, если карточек нет
        ) : (
          filteredTutors.map((tutor, index) => (
            <TutorCard key={index} tutor={tutor} />
          ))
        )}
      </div>
    </div>
  );
}
