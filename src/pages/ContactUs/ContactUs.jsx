import React, { useEffect } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container">
      <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')" }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <h1>Contact <span>Us</span></h1>
            <p>Get in touch to discuss your next project</p>
          </div>
        </div>
      </section>

      <section className="contact-section section-padding">
        <div className="container">
          <div className="contact-grid">
            
            <div className="contact-info fade-in-left">
              <h2>Let's <span>Talk</span></h2>
              <p className="contact-intro">Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.</p>
              
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div className="info-text">
                    <h4>Office Location</h4>
                    <p>123 Architecture Blvd, Design District, NY 10001</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-phone"></i></div>
                  <div className="info-text">
                    <h4>Phone Number</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                  <div className="info-text">
                    <h4>Email Address</h4>
                    <p>hello@aframebuilders.com</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-clock"></i></div>
                  <div className="info-text">
                    <h4>Working Hours</h4>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="social-links mt-4">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="#"><i className="fa-brands fa-twitter"></i></a>
                  <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container fade-in-right">
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <h3>Send a Message</h3>
                
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                
                <div className="form-group">
                  <select required defaultValue="">
                    <option value="" disabled>Subject of Inquiry</option>
                    <option value="residential">Residential Architecture</option>
                    <option value="commercial">Commercial Architecture</option>
                    <option value="interior">Interior Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                
                <button type="submit" className="btn-gold w-100">Send Message</button>
              </form>
            </div>
            
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="map-container fade-in-up">
          {/* Google Maps Embed Placeholder */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.1583091352!2d-74.11976373946229!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1683935292305!5m2!1sen!2s" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          ></iframe>
        </div>
      </section>
      
      <section className="faq-section section-padding" style={{ backgroundColor: 'var(--black-light)' }}>
        <div className="container">
          <div className="section-header text-center fade-in-up">
            <h2>Frequently Asked <span>Questions</span></h2>
            <p className="subtitle">Find answers to common questions about our services</p>
          </div>
          
          <div className="faq-grid fade-in-up">
            <div className="faq-item">
              <h4>What is your typical project timeline?</h4>
              <p>Project timelines vary greatly depending on scope and scale. A typical residential design process takes 3-6 months, while commercial projects can take 6-12 months or more before construction begins.</p>
            </div>
            <div className="faq-item">
              <h4>Do you handle the construction phase as well?</h4>
              <p>Yes, we offer comprehensive construction management services to ensure the design is executed exactly as planned, managing contractors and overseeing quality control.</p>
            </div>
            <div className="faq-item">
              <h4>Can we use our own contractors?</h4>
              <p>Absolutely. While we have a network of trusted contractors, we are happy to work with your preferred builders and provide architectural oversight during the process.</p>
            </div>
            <div className="faq-item">
              <h4>Do you work on international projects?</h4>
              <p>Yes, we have a portfolio of international projects. Our team is equipped to handle design and planning for locations worldwide, adapting to local codes and environments.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
