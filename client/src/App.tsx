import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { UserProvider } from './context/UserContext';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/calendar/Calendar';
import CourseNav from './components/CourseNav';
import BoardPage from './pages/courses/BoardPage';
import PersonsPage from './pages/courses/persons/Persons';
import WorkPage from './pages/courses/work/WorkPage';
import { TaskProvider } from './context/TaskContext';  // Asegúrate de importar el TaskProvider
import { CourseProvider } from './context/CourseContext';
import CalificationsPage from './pages/courses/califications/CalificationsPage';
import AssignmentsPage from './pages/courses/work/assignments/AssignmentsPage';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="h-screen w-screen">
          <CourseProvider>
            <Header />
            <div className="flex">
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/courses/:id/*" element={<CourseLayout />} />
              </Routes>
            </div>
          </CourseProvider>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

function CourseLayout() {
  const { id } = useParams<{ id: string }>(); // id_course desde la ruta
  const location = useLocation(); // Obtiene la ubicación actual

  if (!id) {
    return <p>Curso no encontrado</p>;
  }

  // Verifica si la ruta actual es "entregas/:id"
  const isAssignmentsPage = location.pathname.includes('/entregas/');

  return (
    <TaskProvider id_course={id}>
      <div className="w-full">
        {/* Renderiza CourseNav solo si no es la página de entregas */}
        {!isAssignmentsPage && <CourseNav />}
        <Routes>
          <Route index element={<BoardPage />} />
          <Route path="/personas" element={<PersonsPage />} />
          <Route path="/trabajo" element={<WorkPage />} />
          <Route path="/calificaciones" element={<CalificationsPage />} />
          <Route path="/entregas/:id" element={<AssignmentsPage />} />
        </Routes>
      </div>
    </TaskProvider>
  );
}

export default App;
