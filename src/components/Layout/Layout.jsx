import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import s from './Layout.module.css';
import Header from '../Header/Header';

export default function Layout() {
  return (
    <div className={s.layout}>
      <Header/>
      <div className={s.mainContent}>
        <Sidebar />
        <main className={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
