document.addEventListener('DOMContentLoaded', () => {

  // 1. Load Images from images.js
  if (typeof projectImages !== 'undefined') {
    const attachImg = (id, base64) => {
      const el = document.getElementById('img-' + id);
      if (el && base64) el.src = base64;
    };
    
    attachImg('nashemanPlaza', projectImages.nashemanPlaza);
    attachImg('satyapremiPlaza', projectImages.satyapremiPlaza);
    attachImg('malikComplex', projectImages.malikComplex);
    attachImg('mitraShoppingCenter', projectImages.mitraShoppingCenter);
    attachImg('hotspotMart', projectImages.hotspotMart);
    attachImg('shivPrabhaComplex', projectImages.shivPrabhaComplex);
    attachImg('surenderComplex', projectImages.surenderComplex);
    attachImg('asPlaza', projectImages.asPlaza);
    attachImg('houseConstruction', projectImages.houseConstruction);
    attachImg('upcomingMiniMallA', projectImages.upcomingMiniMallA);
    attachImg('upcomingMiniMallB', projectImages.upcomingMiniMallB);
    attachImg('upcomingMiniMallC', projectImages.upcomingMiniMallC);
    
    attachImg('teamFaraz', projectImages.teamFaraz);
    attachImg('teamAkram', projectImages.teamAkram);
    
    const heroImg = document.getElementById('hero-img');
    if (heroImg && projectImages.heroBackground) {
      heroImg.src = projectImages.heroBackground;
    }
  }

  // 2. Sticky Navbar and Back-to-Top
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // 3. Mobile Menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileBtn.classList.toggle('active');
    mobileBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileBtn.classList.remove('active');
      mobileBtn.textContent = '☰';
    });
  });

  // 4. Hero Text Rotator
  const taglines = document.querySelectorAll('.hero-tagline');
  let currentTagline = 0;
  
  if (taglines.length > 0) {
    setInterval(() => {
      taglines[currentTagline].classList.remove('active');
      currentTagline = (currentTagline + 1) % taglines.length;
      taglines[currentTagline].classList.add('active');
    }, 3500);
  }

  // 5. Animated Counters using IntersectionObserver
  const counters = document.querySelectorAll('.hero-stat-num, .scroll-counter');
  
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        el.innerText = Math.ceil(current) + (target === 100 ? '%' : '+');
        requestAnimationFrame(updateCounter);
      } else {
        el.innerText = target + (target === 100 ? '%' : '+');
      }
    };
    updateCounter();
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // 6. Portfolio Filter logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // 7. About Us Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const indicator = document.getElementById('tab-indicator');
  
  const updateIndicator = (btn) => {
    indicator.style.width = btn.offsetWidth + 'px';
    indicator.style.left = btn.offsetLeft + 'px';
  };

  if(tabBtns.length > 0) updateIndicator(tabBtns[0]);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const target = document.querySelector(btn.getAttribute('data-target'));
      target.classList.add('active');
      
      updateIndicator(btn);
    });
  });

  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if(activeBtn) updateIndicator(activeBtn);
  });

  // 8. Testimonials Carousel
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    
    const getVisibleSlides = () => {
      if(window.innerWidth > 1024) return 3;
      if(window.innerWidth > 768) return 2;
      return 1;
    };

    const updateCarousel = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    const nextSlide = () => {
      const visible = getVisibleSlides();
      if(currentIndex < slides.length - visible) {
        currentIndex++;
      } else {
        currentIndex = 0; // loop back
      }
      updateCarousel();
    };

    const prevSlide = () => {
      const visible = getVisibleSlides();
      if(currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = slides.length - visible; // loop to end
      }
      updateCarousel();
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-scroll every 4 seconds
    let carouselInterval = setInterval(nextSlide, 4000);
    
    // Pause on hover or focus
    const container = document.getElementById('testimonial-carousel');
    container.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    container.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(nextSlide, 4000);
    });
    
    window.addEventListener('resize', updateCarousel);
  }

  // 9. Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  
  if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation is handled by HTML5 `required` attribute.
      // Show success message
      successMsg.style.display = 'block';
      contactForm.reset();
      
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    });
  }

  // 10. Scroll Intersection Observer (Fade in blocks)
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('appear');
        // keep it observed if you want it to fade in/out repeatedly, 
        // otherwise unobserve to only animate once:
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

});
