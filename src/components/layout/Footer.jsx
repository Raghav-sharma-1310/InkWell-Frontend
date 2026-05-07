/*
 * This file provides the global footer component for the Inkwell frontend.
 * It renders consistently across all pages via MainLayout and includes
 * platform info, contact details, quick links, social media, and copyright.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, ArrowUpRight, Heart, BookOpen, Users, HelpCircle, Briefcase, Shield, FileText } from 'lucide-react';
import {
  InfoModal,
  AboutContent,
  PrivacyContent,
  TermsContent,
  ContactContent,
  HelpContent,
  CareersContent,
} from '../ui/InfoModal';

// Defines footer so related behavior stays grouped in one place.
export function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (key) => (e) => {
    e.preventDefault();
    setActiveModal(key);
  };
  const closeModal = () => setActiveModal(null);

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Blogs' },
    { to: '/newsletter', label: 'Newsletter' },
    { to: '/search', label: 'Explore' },
  ];

  const companyLinks = [
    { label: 'About Us', icon: BookOpen, onClick: openModal('about') },
    { label: 'Contact', icon: Mail, onClick: openModal('contact') },
    { label: 'Careers', icon: Briefcase, onClick: openModal('careers') },
    { label: 'Help Center', icon: HelpCircle, onClick: openModal('help') },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', icon: Shield, onClick: openModal('privacy') },
    { label: 'Terms & Conditions', icon: FileText, onClick: openModal('terms') },
  ];

  const socialLinks = [
    { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://github.com', label: 'GitHub', icon: Github },
    { href: 'https://x.com', label: 'Twitter / X', icon: Twitter },
    { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  ];

  const modalMap = {
    about: { title: 'About InkWell', content: <AboutContent /> },
    privacy: { title: 'Privacy Policy', content: <PrivacyContent /> },
    terms: { title: 'Terms & Conditions', content: <TermsContent /> },
    contact: { title: 'Contact Us', content: <ContactContent /> },
    help: { title: 'Help Center', content: <HelpContent /> },
    careers: { title: 'Careers at InkWell', content: <CareersContent /> },
  };

  return (
    <>
      <footer className="inkwell-footer">
        {/* Top accent bar */}
        <div className="inkwell-footer__accent" />

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {/* Main grid */}
          <div className="inkwell-footer__grid">
            {/* Column 1: Brand & description */}
            <div className="inkwell-footer__brand-col">
              <Link to="/" className="inkwell-footer__logo-link">
                <div className="inkwell-footer__logo-icon">
                  <Feather size={16} />
                </div>
                <span className="inkwell-footer__logo-text">InkWell</span>
              </Link>
              <p className="inkwell-footer__description">
                A modern publishing platform empowering writers to create, share, and grow 
                their audience. Open source and community driven.
              </p>

              {/* Social icons */}
              <div className="inkwell-footer__social-row">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inkwell-footer__social-btn"
                  >
                    <social.icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="inkwell-footer__col-heading">Quick Links</h4>
              <ul className="inkwell-footer__link-list">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="inkwell-footer__link">
                      <ArrowUpRight size={12} className="inkwell-footer__link-arrow" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="inkwell-footer__col-heading">Company</h4>
              <ul className="inkwell-footer__link-list">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a href="#" onClick={link.onClick} className="inkwell-footer__link">
                      <ArrowUpRight size={12} className="inkwell-footer__link-arrow" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal + Contact */}
            <div>
              <h4 className="inkwell-footer__col-heading">Support & Legal</h4>
              <ul className="inkwell-footer__link-list">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a href="#" onClick={link.onClick} className="inkwell-footer__link">
                      <ArrowUpRight size={12} className="inkwell-footer__link-arrow" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="inkwell-footer__contact-compact">
                <a href="mailto:contact@inkwell.dev" className="inkwell-footer__contact-item">
                  <Mail size={13} className="inkwell-footer__contact-icon" />
                  <span>contact@inkwell.dev</span>
                </a>
                <a href="tel:+911234567890" className="inkwell-footer__contact-item">
                  <Phone size={13} className="inkwell-footer__contact-icon" />
                  <span>+91 123-456-7890</span>
                </a>
                <div className="inkwell-footer__contact-item">
                  <MapPin size={13} className="inkwell-footer__contact-icon" />
                  <span>Bangalore, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="inkwell-footer__divider" />

          {/* Bottom row */}
          <div className="inkwell-footer__bottom">
            <p className="inkwell-footer__copyright">
              © {currentYear} InkWell. All rights reserved.
            </p>
            <div className="inkwell-footer__bottom-links">
              <a href="#" onClick={openModal('privacy')} className="inkwell-footer__bottom-link">Privacy</a>
              <span className="inkwell-footer__bottom-sep">·</span>
              <a href="#" onClick={openModal('terms')} className="inkwell-footer__bottom-link">Terms</a>
              <span className="inkwell-footer__bottom-sep">·</span>
              <a href="#" onClick={openModal('contact')} className="inkwell-footer__bottom-link">Contact</a>
            </div>
            <p className="inkwell-footer__tagline">
              Built with <Heart size={11} className="inline text-red-500" fill="currentColor" /> using React & Spring Boot
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal && modalMap[activeModal] && (
        <InfoModal
          isOpen={true}
          onClose={closeModal}
          title={modalMap[activeModal].title}
        >
          {modalMap[activeModal].content}
        </InfoModal>
      )}
    </>
  );
}
