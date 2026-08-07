import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const DesignExcellence = lazy(() => import('./pages/DesignExcellence/DesignExcellence'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs'));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/design" element={<DesignExcellence />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
