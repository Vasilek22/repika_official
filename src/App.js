import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import Profile from './pages/Profile/Profile';
import Login from './auth/Login';
import RegStudent from './auth/RegStudent';
import RegTutor from './auth/RegTutor';
import { AuthProvider } from './contexts/AuthContext';
import Lessons from './pages/Lessons/Lessons';
import Tutors from './pages/Tutors/Tutors';
import Dialogues from './pages/Dialogues/Dialogues';
import AddCardPage from './pages/AddCardPage/AddCardPage';
import PrivateRoute from './contexts/PrivateRoute';
import Management from './pages/Management/Management';
import PlatformGoals from './components/PlatformGoals/PlatformGoals';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-student" element={<RegStudent />} />
        <Route path="/register-tutor" element={<RegTutor />} />
        <Route path="/" element={<Layout />}>
          <Route path="profile/:uid" element={<Profile />} />
          <Route path="management" element={<PrivateRoute allowedRoles={['tutor']} element={<Management />} />} />
          <Route index element={<Tutors />} />
          <Route path="add-card" element={<PrivateRoute allowedRoles={['tutor']} element={<AddCardPage />} />} />
          <Route path="goals" element={<PlatformGoals />} />
          <Route path="admin-panel" element={<PrivateRoute allowedRoles={['admin']} element={<Admin />} />} />
          {/*<Route path="lessons" element={<Lessons />} />*/}
          {/*<Route path="dialogues" element={<Dialogues />} />  Главное окно с чатом */}
          {/*<Route path="dialogues/:chatId" element={<Dialogues />} />  Открытие чата */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
