import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './styles/global.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/Admin/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const DesignExcellence = lazy(() => import('./pages/DesignExcellence/DesignExcellence'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminProjects = lazy(() => import('./pages/Admin/AdminProjects'));
const AdminDesignExcellence = lazy(() => import('./pages/Admin/AdminDesignExcellence'));
//commentewre

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/design" element={<DesignExcellence />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Public Admin Route */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Navigate to="/admin/projects" replace />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/design-excellence" element={<AdminDesignExcellence />} />
          </Route>
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
