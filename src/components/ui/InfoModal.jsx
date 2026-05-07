/*
 * This file provides the reusable info-modal overlay for the Inkwell frontend.
 * Footer links (About, Privacy, Terms, Contact, Help) open this modal
 * to display lightweight informational content without needing full pages.
 */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Defines info modal so footer link content can be displayed inline without routing.
export function InfoModal({ isOpen, onClose, title, children }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="info-modal__overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div ref={contentRef} className="info-modal__container">
        {/* Header */}
        <div className="info-modal__header">
          <h2 className="info-modal__title">{title}</h2>
          <button onClick={onClose} className="info-modal__close" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="info-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Pre-built content sections for each footer link ──────── */

export function AboutContent() {
  return (
    <div className="info-modal__content">
      <p>
        <strong>InkWell</strong> is a modern publishing platform designed to empower writers, 
        bloggers, and content creators. Our mission is to provide a seamless, distraction-free 
        writing experience backed by powerful tools for growth and engagement.
      </p>
      <h3>Our Mission</h3>
      <p>
        We believe every voice deserves to be heard. InkWell bridges the gap between creators 
        and their audience with an intuitive editor, real-time analytics, and a vibrant 
        community of readers and writers.
      </p>
      <h3>What Makes Us Different</h3>
      <ul>
        <li><strong>Microservice Architecture</strong> — Built for scale and reliability</li>
        <li><strong>Premium Content</strong> — Monetize your work with PRO subscriptions</li>
        <li><strong>Community-First</strong> — Follow authors, bookmark posts, engage via comments</li>
        <li><strong>Real-time Notifications</strong> — Stay connected with your audience</li>
        <li><strong>Dark Mode</strong> — Comfortable reading experience, day or night</li>
      </ul>
      <h3>Our Team</h3>
      <p>
        InkWell is built by a passionate team of developers and designers who love the written 
        word. We use React, Spring Boot, and cloud-native microservices to deliver a 
        production-grade platform.
      </p>
    </div>
  );
}

export function PrivacyContent() {
  return (
    <div className="info-modal__content">
      <p className="info-modal__updated">Last updated: May 2026</p>
      <h3>1. Information We Collect</h3>
      <p>
        When you register for InkWell, we collect your name, email address, and optional 
        profile details (bio, avatar, phone number). We also collect usage data such as 
        posts read, likes, bookmarks, and comments to personalize your experience.
      </p>
      <h3>2. How We Use Your Data</h3>
      <ul>
        <li>To provide and maintain our platform services</li>
        <li>To personalize your content feed and recommendations</li>
        <li>To send notifications about activity on your posts</li>
        <li>To process subscription payments securely via Razorpay</li>
        <li>To send newsletter communications (with your opt-in consent)</li>
      </ul>
      <h3>3. Data Security</h3>
      <p>
        All passwords are hashed using BCrypt. Authentication is handled via JWT tokens 
        with refresh-token rotation. Payment data is processed through PCI-compliant 
        gateways — we never store card details.
      </p>
      <h3>4. Your Rights</h3>
      <p>
        You can update or delete your profile at any time. You may unsubscribe from 
        newsletters via the one-click unsubscribe link. For data deletion requests, 
        contact us at <a href="mailto:privacy@inkwell.dev">privacy@inkwell.dev</a>.
      </p>
      <h3>5. Cookies</h3>
      <p>
        We use essential cookies for authentication and theme preferences. No third-party 
        tracking cookies are used.
      </p>
    </div>
  );
}

export function TermsContent() {
  return (
    <div className="info-modal__content">
      <p className="info-modal__updated">Last updated: May 2026</p>
      <h3>1. Acceptance of Terms</h3>
      <p>
        By accessing or using InkWell, you agree to be bound by these Terms of Service. 
        If you do not agree, you may not use the platform.
      </p>
      <h3>2. User Accounts</h3>
      <ul>
        <li>You must provide accurate information during registration</li>
        <li>You are responsible for maintaining the security of your account</li>
        <li>One person per account — no shared or automated accounts</li>
        <li>Minimum age requirement: 13 years</li>
      </ul>
      <h3>3. Content Guidelines</h3>
      <p>
        Authors retain ownership of their original content. By publishing on InkWell, 
        you grant us a non-exclusive license to display and distribute your content on 
        the platform. Content must not violate applicable laws, contain hate speech, 
        or infringe on intellectual property rights.
      </p>
      <h3>4. Subscriptions & Payments</h3>
      <p>
        PRO subscriptions are billed as described during checkout. Payments are 
        processed through Razorpay. Refund requests must be submitted within 7 days 
        of purchase.
      </p>
      <h3>5. Termination</h3>
      <p>
        We reserve the right to suspend or terminate accounts that violate these terms. 
        You may delete your account at any time through your profile settings.
      </p>
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="info-modal__content">
      <h3>Get in Touch</h3>
      <p>
        We'd love to hear from you! Whether you have a question, feedback, or need 
        support, reach out through any of the channels below.
      </p>
      <div className="info-modal__contact-grid">
        <div className="info-modal__contact-card">
          <h4>📧 Email Support</h4>
          <p>For general inquiries and support:</p>
          <a href="mailto:contact@inkwell.dev">contact@inkwell.dev</a>
        </div>
        <div className="info-modal__contact-card">
          <h4>🐛 Bug Reports</h4>
          <p>Found a bug? Use the feedback widget (bottom-right corner) or email:</p>
          <a href="mailto:bugs@inkwell.dev">bugs@inkwell.dev</a>
        </div>
        <div className="info-modal__contact-card">
          <h4>📱 Phone</h4>
          <p>Available Mon–Fri, 10 AM – 6 PM IST:</p>
          <a href="tel:+911234567890">+91 123-456-7890</a>
        </div>
        <div className="info-modal__contact-card">
          <h4>📍 Office</h4>
          <p>InkWell HQ</p>
          <p>Bangalore, Karnataka, India</p>
        </div>
      </div>
      <h3>Response Time</h3>
      <p>
        We typically respond within 24 hours on business days. For urgent issues, 
        please use the in-app feedback widget for priority routing.
      </p>
    </div>
  );
}

export function HelpContent() {
  return (
    <div className="info-modal__content">
      <h3>Getting Started</h3>
      <ul>
        <li><strong>Create an Account</strong> — Register with email or sign in with Google/GitHub</li>
        <li><strong>Verify Your Email</strong> — Check your inbox for the verification link</li>
        <li><strong>Explore Content</strong> — Browse posts by category, tag, or use the search</li>
        <li><strong>Engage</strong> — Like, comment, bookmark, and follow your favorite authors</li>
      </ul>
      <h3>Becoming an Author</h3>
      <p>
        Want to publish your own posts? Go to <strong>Profile → Request Author Role</strong>. 
        An admin will review your request, typically within 24–48 hours. Once approved, 
        you'll unlock the Author Studio with a rich text editor, media manager, and analytics.
      </p>
      <h3>PRO Subscription</h3>
      <p>
        Upgrade to PRO to access premium content from top authors. Visit 
        <strong> Profile → Subscription</strong> to view plans and upgrade. Payment is 
        processed securely via Razorpay.
      </p>
      <h3>Newsletter</h3>
      <p>
        Subscribe to our newsletter to get weekly curated picks delivered to your inbox. 
        We use double opt-in — confirm your email to start receiving updates. Unsubscribe 
        anytime with one click.
      </p>
      <h3>Need More Help?</h3>
      <p>
        Use the <strong>feedback widget</strong> (floating button at the bottom-right) to 
        report issues or ask questions directly. Our support team will respond within 24 hours.
      </p>
    </div>
  );
}

export function CareersContent() {
  return (
    <div className="info-modal__content">
      <h3>Join the InkWell Team</h3>
      <p>
        We're always looking for talented individuals who are passionate about technology 
        and content creation. InkWell is a remote-first team building the future of 
        digital publishing.
      </p>
      <h3>Open Positions</h3>
      <div className="info-modal__careers-list">
        <div className="info-modal__career-item">
          <h4>Senior Backend Developer</h4>
          <p>Spring Boot · Microservices · Java 21</p>
          <span className="info-modal__career-tag">Remote · Full-time</span>
        </div>
        <div className="info-modal__career-item">
          <h4>Frontend Engineer</h4>
          <p>React · Vite · TailwindCSS</p>
          <span className="info-modal__career-tag">Remote · Full-time</span>
        </div>
        <div className="info-modal__career-item">
          <h4>DevOps Engineer</h4>
          <p>Docker · Kubernetes · CI/CD</p>
          <span className="info-modal__career-tag">Remote · Full-time</span>
        </div>
        <div className="info-modal__career-item">
          <h4>Technical Writer</h4>
          <p>API Docs · Developer Guides</p>
          <span className="info-modal__career-tag">Remote · Part-time</span>
        </div>
      </div>
      <h3>How to Apply</h3>
      <p>
        Send your resume and a brief introduction to{' '}
        <a href="mailto:careers@inkwell.dev">careers@inkwell.dev</a>. 
        We'll get back to you within a week.
      </p>
    </div>
  );
}
