import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './styles/global.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Preloader from './components/Loader/Preloader';
import RouteLoader from './components/Loader/RouteLoader';

const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const DesignExcellence = lazy(() => import('./pages/DesignExcellence/DesignExcellence'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminProjects = lazy(() => import('./pages/Admin/AdminProjects'));
const AdminDesignExcellence = lazy(() => import('./pages/Admin/AdminDesignExcellence'));
const AdminHeroImages = lazy(() => import('./pages/Admin/AdminHeroImages'));

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Initialize Lenis Momentum Smooth Scroll
  useEffect(() => {
    if (isAdminRoute) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, [isAdminRoute]);

  // Scroll to top on route navigation
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      {!isAdminRoute && <Preloader />}
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/design" element={<DesignExcellence />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Public Admin Route */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Navigate to="/admin/projects" replace />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/design-excellence" element={<AdminDesignExcellence />} />
            <Route path="/admin/hero-images" element={<AdminHeroImages />} />
          </Route>
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
