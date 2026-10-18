/**
 * ============================================================================
 * NATIONAL SERVICE CENTRE — CONTROLLER & VALIDATOR (Vanilla JavaScript ES6+)
 * Handlers: Sticky Header, Mobile Drawer Navigation, Quick Enquiry Form,
 * FAQ Accordion, Gallery, Booking Validation, and WhatsApp Dispatch
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STICKY HEADER SCROLL STATE
  // --------------------------------------------------------------------------
  const mainNavHeader = document.getElementById('mainNavHeader');

  const handleScroll = () => {
    if (window.scrollY > 30) {
      mainNavHeader.classList.add('scrolled');
    } else {
      mainNavHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-drawer-links a, .mobile-drawer-contact a');

  if (mobileToggleBtn && mobileDrawer) {
    const toggleMenu = () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    const closeMenu = () => {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    mobileToggleBtn.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMenu();
        mobileToggleBtn.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. ACTIVE NAV LINK ON SCROLL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop-menu .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0 && desktopNavLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 4. FAQ ACCORDION INTERACTION
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstTrigger = faqItems[0].querySelector('.faq-trigger');
    const firstContent = faqItems[0].querySelector('.faq-content');
    if (firstTrigger && firstContent) {
      firstTrigger.setAttribute('aria-expanded', 'true');
      faqItems[0].classList.add('active');
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }

  // --------------------------------------------------------------------------
  // 5. IMMEDIATE SERVICE ENQUIRY FORM (BELOW HERO)
  // --------------------------------------------------------------------------
  const quickEnquiryForm = document.getElementById('quickEnquiryForm');
  const BUSINESS_PHONE_RAW = '916300454801';
  const BUSINESS_PHONE_DISPLAY = '+91 63004 54801';

  if (quickEnquiryForm) {
    quickEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('quickName');
      const phoneInput = document.getElementById('quickPhone');
      const applianceSelect = document.getElementById('quickAppliance');
      const locationInput = document.getElementById('quickLocation');

      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      const validPhone = /^[6-9]\d{9}$/.test(phoneDigits);

      if (!nameInput.value.trim()) {
        alert('Please enter your full name.');
        nameInput.focus();
        return;
      }

      if (!validPhone) {
        alert('Please enter a valid 10-digit mobile number.');
        phoneInput.focus();
        return;
      }

      if (!applianceSelect.value) {
        alert('Please select your appliance type.');
        applianceSelect.focus();
        return;
      }

      if (!locationInput.value.trim()) {
        alert('Please enter your locality / area.');
        locationInput.focus();
        return;
      }

      // Pre-compose WhatsApp request
      const message = 
`*NEW QUICK SERVICE ENQUIRY*
*National Service Centre*
--------------------------------
*Customer:* ${nameInput.value.trim()}
*Phone:* ${phoneDigits}
*Appliance:* ${applianceSelect.value}
*Locality:* ${locationInput.value.trim()}
--------------------------------
Please confirm available technician slot.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${BUSINESS_PHONE_RAW}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // --------------------------------------------------------------------------
  // 6. MAIN BOOKING FORM (SECTION 15) VALIDATION & DISPATCH
  // --------------------------------------------------------------------------
  const mainContactForm = document.getElementById('mainContactForm');
  const mainSubmitBtn = document.getElementById('mainSubmitBtn');
  const formFeedbackAlert = document.getElementById('formFeedbackAlert');
  const mainApplianceSelect = document.getElementById('mainAppliance');

  if (mainContactForm) {
    const setFieldError = (inputEl, errorEl, msg) => {
      inputEl.classList.add('is-invalid');
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    };

    const clearFieldError = (inputEl, errorEl) => {
      inputEl.classList.remove('is-invalid');
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    };

    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Name validation
      const nameEl = document.getElementById('mainName');
      const nameErr = document.getElementById('mainNameError');
      if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
        setFieldError(nameEl, nameErr, 'Please enter your full name.');
        isValid = false;
      } else {
        clearFieldError(nameEl, nameErr);
      }

      // Phone validation
      const phoneEl = document.getElementById('mainPhone');
      const phoneErr = document.getElementById('mainPhoneError');
      const phoneDigits = phoneEl.value.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
        setFieldError(phoneEl, phoneErr, 'Please enter a valid 10-digit mobile number.');
        isValid = false;
      } else {
        clearFieldError(phoneEl, phoneErr);
      }

      // Appliance validation
      const appErr = document.getElementById('mainApplianceError');
      if (!mainApplianceSelect.value) {
        setFieldError(mainApplianceSelect, appErr, 'Please choose your appliance.');
        isValid = false;
      } else {
        clearFieldError(mainApplianceSelect, appErr);
      }

      // Location validation
      const locEl = document.getElementById('mainLocation');
      const locErr = document.getElementById('mainLocationError');
      if (!locEl.value.trim()) {
        setFieldError(locEl, locErr, 'Please enter your locality in Hyderabad / Secunderabad.');
        isValid = false;
      } else {
        clearFieldError(locEl, locErr);
      }

      if (!isValid) {
        const firstErr = mainContactForm.querySelector('.is-invalid');
        if (firstErr) firstErr.focus();
        return;
      }

      const brandVal = document.getElementById('mainBrand').value.trim() || 'Not Specified';
      const timeVal = document.getElementById('mainTime').value || 'Anytime';
      const issueVal = document.getElementById('mainIssue').value.trim() || 'Inspection & diagnosis needed';

      mainSubmitBtn.disabled = true;
      mainSubmitBtn.innerHTML = `<span>Preparing Request...</span>`;

      const waMessage = 
`*NEW REPAIR BOOKING REQUEST*
*National Service Centre*
--------------------------------
*Customer:* ${nameEl.value.trim()}
*Phone:* ${phoneDigits}
*Appliance:* ${mainApplianceSelect.value}
*Brand:* ${brandVal}
*Locality:* ${locEl.value.trim()}
*Preferred Time:* ${timeVal}
*Issue Description:* ${issueVal}
--------------------------------
Please confirm technician visit schedule.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${BUSINESS_PHONE_RAW}&text=${encodeURIComponent(waMessage)}`;

      setTimeout(() => {
        mainSubmitBtn.disabled = false;
        mainSubmitBtn.innerHTML = `
          <span>Request Service</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;

        formFeedbackAlert.className = 'form-feedback-alert success';
        formFeedbackAlert.innerHTML = `
          <strong>Details validated:</strong> Redirecting to WhatsApp with your prefilled repair request. 
          Please tap 'Send' to complete dispatch, or call directly at 
          <a href="tel:${BUSINESS_PHONE_DISPLAY.replace(/\s+/g, '')}" style="text-decoration: underline; font-weight:700; color: inherit;">${BUSINESS_PHONE_DISPLAY}</a>.
        `;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    });

    ['mainName', 'mainPhone', 'mainLocation'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const err = document.getElementById(id + 'Error');
          if (err && el.classList.contains('is-invalid')) {
            clearFieldError(el, err);
          }
        });
      }
    });

    if (mainApplianceSelect) {
      mainApplianceSelect.addEventListener('change', () => {
        const err = document.getElementById('mainApplianceError');
        if (err && mainApplianceSelect.classList.contains('is-invalid')) {
          clearFieldError(mainApplianceSelect, err);
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. SERVICE DETAIL MODAL CONTROLLER
  // --------------------------------------------------------------------------
  const SERVICE_DATA = {
    'Washing Machine': {
      title: 'Washing Machine Repair & Service',
      category: 'Doorstep Appliance Service',
      image: 'assets/washing-machine-repair.jpg',
      price: '₹249',
      desc: 'Expert doorstep diagnostics and component repairs for all major front-load, top-load, and semi-automatic washing machines. We use authentic spare parts backed by our 90-day warranty.',
      types: ['Front Load', 'Top Load', 'Semi-Automatic', 'Inverter Direct Drive', 'Commercial Washers'],
      issues: [
        'Drain pump jamming, water drainage failure, or E24 / 5E error codes',
        'Spin-cycle failure, drum not rotating, or violent vibration & rumbling noise',
        'Water continuously filling due to faulty solenoid inlet valves',
        'Inverter PCB motherboard circuit diagnostics and relay replacements',
        'Door lock switch malfunction, broken latch, or rubber bellow gasket tear'
      ]
    },
    'Refrigerator': {
      title: 'Refrigerator & Deep Freezer Repair',
      category: 'Doorstep Refrigeration Service',
      image: 'assets/refrigerator-repair.jpg',
      price: '₹249',
      desc: 'Precision temperature diagnostics, certified eco-friendly refrigerant gas top-up, and compressor repairs for single-door, double-door, frost-free, and side-by-side refrigerators.',
      types: ['Single Door', 'Double Door', 'Frost-Free', 'Side-by-Side Inverter', 'French Door', 'Deep Freezer'],
      issues: [
        'Insufficient cooling in the fridge compartment while freezer is freezing',
        'Certified R134a / R600a eco-gas leak detection, brazing, and precision recharging',
        'Inverter compressor clicking, failing to start, or overheating',
        'Defrost sensor, heating coil, bimetal thermostat, and defrost timer renewal',
        'Excessive water pooling inside crisper drawers or rear condenser coil freeze-up'
      ]
    },
    'Air Conditioner': {
      title: 'Air Conditioner (AC) Service & Repair',
      category: 'Doorstep HVAC Service',
      image: 'assets/about-ac-repair.jpg',
      price: '₹249',
      desc: 'Complete air conditioning solutions including high-pressure power jet foam cleaning, copper coil leak welding, nitrogen pressure testing, and inverter PCB board diagnostics.',
      types: ['Split AC', 'Window AC', 'Inverter AC', '5-Star Dual Inverter', 'Cassette Units'],
      issues: [
        'Low cooling performance or AC blowing room-temperature air',
        'High-pressure power-jet foam servicing for indoor cooling fins and outdoor condenser',
        'Copper coil micro-leak repair, nitrogen pressure testing, and R32 / R410A gas top-up',
        'Inverter PCB motherboard communication faults (CH / E1 / E3 error codes)',
        'Water dripping from indoor split unit due to choked condensate drain pipes'
      ]
    },
    'Microwave Oven': {
      title: 'Microwave Oven Repair & Diagnostics',
      category: 'Doorstep Kitchen Appliance Service',
      image: 'assets/microwave-repair.jpg',
      price: '₹249',
      desc: 'Accurate component-level repair for solo, grill, and convection microwaves. Our certified technicians safely troubleshoot high-voltage circuits and calibrate microwave performance.',
      types: ['Solo Microwave', 'Grill Microwave', 'Convection Oven', 'Built-in OTG'],
      issues: [
        'Microwave running normally but food remains cold (magnetron / diode failure)',
        'Touch membrane keypad or digital touch panel completely unresponsive',
        'Sparking or arcing inside the cavity (burnt mica waveguide cover)',
        'Glass turntable plate not rotating or broken roller ring guide',
        'High-voltage capacitor failure, blown ceramic fuse, or loud humming noise'
      ]
    },
    'Dishwasher': {
      title: 'Dishwasher Repair & Descaling Service',
      category: 'Doorstep Kitchen Appliance Service',
      image: 'assets/dishwasher-repair.jpg',
      price: '₹249',
      desc: 'Comprehensive diagnostics for freestanding and integrated dishwashers. We resolve drainage blocks, hard-water mineral scaling, wash arm pressure drops, and heater element issues.',
      types: ['12–14 Place Settings', 'Freestanding', 'Fully Integrated / Built-in', 'Table Top'],
      issues: [
        'Water not draining out completely with E24 / E25 drain error indicator',
        'Dishes coming out dirty, cloudy, or white-stained due to clogged spray arms',
        'Water leaking from bottom door seals or faulty inlet solenoid valve',
        'Water heating failure resulting in lukewarm wash and wet drying cycles',
        'Circulation wash pump humming, jammed impeller, or main PCB error code'
      ]
    },
    'Other Supported Appliance': {
      title: 'Electronics & Domestic Appliance Diagnostics',
      category: 'Advanced Diagnostics Support',
      image: 'assets/service-technician-diagnostics.jpg',
      price: '₹249',
      desc: 'General electronic troubleshooting and component-level circuit board diagnostics for domestic home appliances, voltage surge damages, and sensor failures across multi-brand units.',
      types: ['Inverter Motherboards', 'Power Supply Units', 'Voltage Surge Check', 'Multi-Brand Domestic Appliances'],
      issues: [
        'Power supply failure following sudden electrical spikes or voltage fluctuations',
        'Micro-soldering, blown capacitor renewal, and motherboard trace repair',
        'Digital temperature sensor and thermistor drift calibration',
        'Wiring harness restoration and rodent-damaged electrical cable repair',
        'Comprehensive multi-point safety testing and power consumption audit'
      ]
    }
  };

  const serviceDetailModal = document.getElementById('serviceDetailModal');
  const serviceModalCard = document.getElementById('serviceModalCard');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalBookNowBtn = document.getElementById('modalBookNowBtn');

  const modalServiceTitle = document.getElementById('modalServiceTitle');
  const modalServiceCategory = document.getElementById('modalServiceCategory');
  const modalServiceImage = document.getElementById('modalServiceImage');
  const modalServicePrice = document.getElementById('modalServicePrice');
  const modalServiceDesc = document.getElementById('modalServiceDesc');
  const modalApplianceTypes = document.getElementById('modalApplianceTypes');
  const modalCommonIssues = document.getElementById('modalCommonIssues');

  let currentModalAppliance = 'Washing Machine';

  const openServiceModal = (applianceKey) => {
    const data = SERVICE_DATA[applianceKey] || SERVICE_DATA['Washing Machine'];
    currentModalAppliance = applianceKey;

    if (modalServiceTitle) modalServiceTitle.textContent = data.title;
    if (modalServiceCategory) modalServiceCategory.textContent = data.category;
    if (modalServicePrice) modalServicePrice.textContent = data.price;
    if (modalServiceDesc) modalServiceDesc.textContent = data.desc;

    if (modalServiceImage) {
      modalServiceImage.src = data.image;
      modalServiceImage.alt = `${data.title} technician service`;
    }

    if (modalApplianceTypes) {
      modalApplianceTypes.innerHTML = data.types
        .map(t => `<span class="service-pill">${t}</span>`)
        .join('');
    }

    if (modalCommonIssues) {
      modalCommonIssues.innerHTML = data.issues
        .map(issue => `<li>${issue}</li>`)
        .join('');
    }

    if (serviceDetailModal) {
      serviceDetailModal.setAttribute('aria-hidden', 'false');
      serviceDetailModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (modalCloseBtn) modalCloseBtn.focus();
    }
  };

  const closeServiceModal = () => {
    if (serviceDetailModal && serviceDetailModal.classList.contains('active')) {
      serviceDetailModal.setAttribute('aria-hidden', 'true');
      serviceDetailModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Wire all "Explore Service" links
  const serviceCardLinks = document.querySelectorAll('.service-action-link[data-appliance]');
  serviceCardLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const applianceTarget = link.getAttribute('data-appliance');
      openServiceModal(applianceTarget);
    });
  });

  // Modal Close buttons
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeServiceModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeServiceModal);

  // Close when clicking outside the card
  if (serviceDetailModal) {
    serviceDetailModal.addEventListener('click', (e) => {
      if (e.target === serviceDetailModal) {
        closeServiceModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceDetailModal && serviceDetailModal.classList.contains('active')) {
      closeServiceModal();
    }
  });

  // Modal "Book This Service" CTA:
  // Closes modal, preselects dropdown in main booking form and quick form, and smooth-scrolls to #booking
  if (modalBookNowBtn) {
    modalBookNowBtn.addEventListener('click', () => {
      closeServiceModal();

      if (mainApplianceSelect && currentModalAppliance) {
        mainApplianceSelect.value = currentModalAppliance;
        mainApplianceSelect.dispatchEvent(new Event('change'));
      }

      const quickAppliance = document.getElementById('quickAppliance');
      if (quickAppliance && currentModalAppliance) {
        quickAppliance.value = currentModalAppliance;
      }

      const bookingSection = document.getElementById('booking') || document.getElementById('contact');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const mainName = document.getElementById('mainName');
          if (mainName) mainName.focus();
        }, 600);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. INTERACTIVE SCROLL REVEAL & STAT COUNTER ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-stagger');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Animated Numbers Counter for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const animateCounter = (el) => {
      const rawText = el.textContent.trim();
      const match = rawText.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
      if (!match) return;

      const prefix = match[1] || '';
      const numValue = parseFloat(match[2].replace(/,/g, ''));
      const suffix = match[3] || '';
      const isInteger = !match[2].includes('.');
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (numValue * easeOut);

        if (isInteger) {
          el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
        } else {
          el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = rawText; // restore original clean format
        }
      };

      requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

});

