/**
 * TEDx Website - Main JavaScript File
 * Handles all interactive elements and dynamic content
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('toggle');
      navLinks.classList.toggle('nav-active');
      document.body.classList.toggle('no-scroll');
    });
  }
  
  // Close mobile menu when clicking on a nav link
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger.classList.contains('toggle')) {
        hamburger.classList.remove('toggle');
        navLinks.classList.remove('nav-active');
        document.body.classList.remove('no-scroll');
      }
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 100; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Countdown Timer
  function updateCountdown() {
    const eventDate = new Date('March 7, 2026 19:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update the countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // If the countdown is finished
    if (distance < 0) {
      clearInterval(countdownInterval);
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
    }
  }
  
  // Update the countdown every second
  let countdownInterval;
  if (document.getElementById('days')) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }
  
  // Back to Top Button
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Tab functionality for schedule
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-day');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Accordion behavior (used on Events and Tickets pages)
  const accordionHeaders = document.querySelectorAll('.accordion .accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const accordion = item.parentElement;

      // close all others in this accordion
      accordion.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('open');
      });

      // toggle current
      item.classList.toggle('open');
    });
  });

  // Load speakers data
  function loadSpeakers() {
    const speakersGrid = document.querySelector('.speakers-grid');
    if (!speakersGrid) return;
    
    const speakers = [];
    
    speakers.forEach(speaker => {
      const speakerCard = document.createElement('div');
      speakerCard.className = 'speaker-card';
      speakerCard.innerHTML = `
        <img src="${speaker.image}" alt="${speaker.name}" class="speaker-img">
        <div class="speaker-info">
          <h3 class="speaker-name">${speaker.name}</h3>
          <p class="speaker-title">${speaker.title}</p>
          <p class="speaker-bio">${speaker.bio}</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="social-link" aria-label="Website"><i class="fas fa-globe"></i></a>
          </div>
        </div>
      `;
      speakersGrid.appendChild(speakerCard);
    });
  }
  
  // Load schedule data
  function loadSchedule() {
    const day1Content = document.getElementById('day1');
    const day2Content = document.getElementById('day2');
    
    if (!day1Content || !day2Content) return;
    
    const day1Schedule = [];
    
    const day2Schedule = [];
    
    // Populate Day 1 schedule
    day1Schedule.forEach(item => {
      const scheduleItem = createScheduleItem(item);
      day1Content.appendChild(scheduleItem);
    });
    
    // Populate Day 2 schedule
    day2Schedule.forEach(item => {
      const scheduleItem = createScheduleItem(item);
      day2Content.appendChild(scheduleItem);
    });
    
    function createScheduleItem(item) {
      const itemEl = document.createElement('div');
      itemEl.className = 'schedule-item';
      itemEl.innerHTML = `
        <div class="schedule-time">${item.time}</div>
        <div class="schedule-details">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `;
      return itemEl;
    }
  }
  
  // Initialize components
  loadSpeakers();
  loadSchedule();
  
  // Form validation for newsletter
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!isValidEmail(email)) {
        emailInput.classList.add('is-invalid');
        return;
      }
      
      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
      
      // Simulate API call
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        emailInput.value = '';
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success mt-3';
        successMsg.textContent = 'Thank you for subscribing to our newsletter!';
        this.appendChild(successMsg);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
          successMsg.remove();
        }, 3000);
      }, 1500);
    });
    
    // Clear validation on input
    const emailInputField = newsletterForm.querySelector('input[type="email"]');
    emailInputField.addEventListener('input', function() {
      this.classList.remove('is-invalid');
    });
  }

  // Email validation helper (used by newsletter + contact forms)

// Email validation helper (used by newsletter + contact forms)
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Contact form -> submit to Formspree
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const statusEl = document.getElementById('contact-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const name = (nameInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();
    const subject = (subjectInput?.value || '').trim();
    const message = (messageInput?.value || '').trim();

    // Basic validation
    let hasError = false;
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (!input) return;
      input.classList.remove('is-invalid');
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        hasError = true;
      }
    });
    if (email && !isValidEmail(email)) {
      emailInput?.classList.add('is-invalid');
      hasError = true;
    }
    if (hasError) return;

    // Submit to Formspree using fetch
    const formAction = contactForm.getAttribute('action');
    if (!formAction || formAction.includes('YOUR_FORM_ID')) {
      if (statusEl) statusEl.textContent = 'Contact form is not configured yet. Please add your Formspree form ID.';
      return;
    }

    if (statusEl) statusEl.textContent = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
    }

    const formData = new FormData(contactForm);

    fetch(formAction, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(async (response) => {
        if (response.ok) {
          if (statusEl) statusEl.textContent = 'Thanks! Your message has been sent.';
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => null);
          const err = data && data.errors && data.errors.length
            ? data.errors.map(e => e.message).join(', ')
            : 'Unable to send message right now.';
          if (statusEl) statusEl.textContent = `Error: ${err}`;
        }
      })
      .catch(() => {
        if (statusEl) statusEl.textContent = 'Network error. Please try again later.';
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-loading');
        }
      });
    });

    // Clear validation state on input
    ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        if (statusEl) statusEl.textContent = '';
      });
    });
  }

  // Reveal sections when they enter the viewport
  const revealOnScroll = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const threshold = 100; // start revealing a bit before
      if (rect.top < window.innerHeight - threshold) {
        section.classList.add('visible');
      }
    });
  };

  // Initial and scroll checks
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});