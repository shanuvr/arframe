import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Expertise from '../components/Expertise/Expertise';
import DesignExcellence from '../components/DesignExcellence/DesignExcellence';
import FeaturedProjects from '../components/FeaturedProjects/FeaturedProjects';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import BeforeAfter from '../components/BeforeAfter/BeforeAfter';
import Team from '../components/Team/Team';
import Testimonials from '../components/Testimonials/Testimonials';
import Contact from '../components/Contact/Contact';

const Home = () => {
  return (
    <main>
      <Hero />
      <About />
      <Expertise />
      <BeforeAfter />
      <DesignExcellence />
      <FeaturedProjects />
      <WhyChooseUs />
      <Team />
      <Testimonials />
      <Contact alignTop={true} />
    </main>
  );
};

export default Home;
