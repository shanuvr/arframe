import { Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import DesignExcellence from './pages/DesignExcellence/DesignExcellence';
import Projects from './pages/Projects/Projects';
import ContactUs from './pages/ContactUs/ContactUs';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/design" element={<DesignExcellence />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
