import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { useHeroImages } from '../../hooks/useHeroImages.js';
import { buildImageUrl } from '../../api/pageSettings.js';
import './ContactUs.css';

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { settings } = useHeroImages();
  const contactHero = buildImageUrl(settings?.contact_hero?.image) || '/pagehero/aboutushero.jpg';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: 'Project Enquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/api/contact', formData);
      setStatus({
        type: 'success',
        message: response.data?.message || 'Enquiry sent successfully!'
      });
      setFormData({
        full_name: '',
        email: '',
        subject: 'Project Enquiry',
        message: ''
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      id: 1,
      question: "What is your typical project timeline?",
      answer: "Timelines vary based on scope. Conceptual design and schematic drawings usually take 4-8 weeks, while full architectural planning and permit approval ranges from 3-6 months."
    },
    {
      id: 2,
      question: "Do you handle construction management?",
      answer: "Yes. We offer end-to-end services from initial sketches to general contracting and final site inspection, ensuring total fidelity to the original design intent."
    },
    {
      id: 3,
      question: "Can we work with our own contractors?",
      answer: "Absolutely. We frequently collaborate with external contractor teams, providing comprehensive technical drawings, specifications, and periodic site oversight."
    },
    {
      id: 4,
      question: "Do you undertake international projects?",
      answer: "Yes. We serve clients globally. Our team coordinates remote site surveys, international building codes, and local regulatory compliance for seamless execution."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="page-container">
      {/* Page Hero */}
      <section className="page-hero" style={{ backgroundImage: `url('${contactHero}')` }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <h1>Contact <span>Us</span></h1>
            <p>Get in touch to discuss your next architectural landmark</p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            
            {/* Info Side */}
            <div className="contact-info fade-in-left">
              <span className="contact-label">Reach Out To Us</span>
              <h2>Let's Start a <span>Conversation</span></h2>
              <p className="contact-intro">Whether you have a question about our services, project estimates, or design consultations, our team is ready to assist you.</p>
              
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div className="info-text">
                    <h4>Headquarters</h4>
                    <p>123 Architecture Blvd, Design District, NY 10001</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-phone"></i></div>
                  <div className="info-text">
                    <h4>Direct Call</h4>
                    <p>+91 9712337226</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                  <div className="info-text">
                    <h4>Email Inquiry</h4>
                    <p>aframe.ind@gmail.com</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-clock"></i></div>
                  <div className="info-text">
                    <h4>Business Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h4>Connect With Us</h4>
                <div className="social-icons">
                  <a href="https://www.instagram.com/aframe_builders?stkn=MTA1bXRmdWRoNmQ1cA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                  <a href="https://www.facebook.com/share/1Haa2Earky/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
              </div>
            </div>
            
            {/* Form Side */}
            <div className="contact-form-card fade-in-right">
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3>Send Us a Message</h3>
                <p className="form-subtext">Fill in the form below and our lead architect will get back to you within 24 hours.</p>
                
                <div className="form-group">
                  <label htmlFor="fullName">Your Full Name</label>
                  <input
                    id="fullName"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="emailAddr">Your Email Address</label>
                  <input
                    id="emailAddr"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="inquiryType">Subject of Inquiry</label>
                  <select
                    id="inquiryType"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="Project Enquiry">Project Enquiry</option>
                    <option value="Residential Architecture">Residential Architecture</option>
                    <option value="Commercial Architecture">Commercial Architecture</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Landscape & Exterior">Landscape & Exterior</option>
                    <option value="Other Inquiry">Other Inquiry</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="msgText">Your Message</label>
                  <textarea
                    id="msgText"
                    name="message"
                    placeholder="Tell us about your project vision, timeline, and location..."
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-gold submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'} <i className="fa-solid fa-paper-plane" style={{ marginLeft: '8px' }}></i>
                </button>

                {status.message && (
                  <div className={`status-alert ${status.type}`} style={{ marginTop: '15px', padding: '10px 14px', borderRadius: '4px', textAlign: 'center', fontSize: '14px', fontWeight: '500', backgroundColor: status.type === 'success' ? 'rgba(40,167,69,0.15)' : 'rgba(220,53,69,0.15)', color: status.type === 'success' ? '#28a745' : '#dc3545', border: status.type === 'success' ? '1px solid rgba(40,167,69,0.3)' : '1px solid rgba(220,53,69,0.3)' }}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>
            
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-wrapper fade-in-up">
          <iframe 
            src="https://maps.google.com/maps?q=10.520088,76.196966&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="section-header text-center fade-in-up">
            <span className="faq-label">Got Questions?</span>
            <h2>Frequently Asked <span>Questions</span></h2>
            <p className="subtitle">Find quick answers to common inquiries about working with AFRAME Builders.</p>
          </div>
          
          <div className="faq-accordion fade-in-up">
            {faqs.map((faq, index) => (
              <div 
                className={`accordion-item ${openFaq === index ? 'active' : ''}`} 
                key={faq.id}
              >
                <button 
                  className="accordion-header" 
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="faq-question">{faq.question}</span>
                  <span className="accordion-icon">
                    <i className={`fa-solid ${openFaq === index ? 'fa-minus' : 'fa-plus'}`}></i>
                  </span>
                </button>
                <div className="accordion-body">
                  <div className="accordion-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
