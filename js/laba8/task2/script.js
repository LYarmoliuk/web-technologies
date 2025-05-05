
const config = {
    images: [
      'https://picsum.photos/id/1018/800/400',
      'https://picsum.photos/id/1015/800/400',
      'https://picsum.photos/id/1019/800/400',
      'https://picsum.photos/id/1020/800/400'
    ],
    transitionDuration: 500, // ms
    autoplay: true,
    autoplayDelay: 3000, // ms
    showArrows: true,
    showDots: true,
  };
  
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderDots = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slider = document.getElementById('slider');
  
  let currentSlide = 0;
  let intervalId;
  
  function createSlides() {
    config.images.forEach(img => {
      const slide = document.createElement('div');
      slide.classList.add('slider-slide');
      slide.innerHTML = `<img src="${img}" alt="slide">`;
      sliderTrack.appendChild(slide);
    });
  
    if (config.showDots) {
      config.images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
      });
    }
  
    updateDots();
  }
  
  function updateSlider() {
    const offset = -currentSlide * 100;
    sliderTrack.style.transform = `translateX(${offset}%)`;
    updateDots();
  }
  
  function updateDots() {
    if (config.showDots) {
      const dots = sliderDots.querySelectorAll('button');
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentSlide].classList.add('active');
    }
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % config.images.length;
    updateSlider();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + config.images.length) % config.images.length;
    updateSlider();
  }
  
  function goToSlide(index) {
    currentSlide = index;
    updateSlider();
  }
  
  function startAutoplay() {
    if (config.autoplay) {
      intervalId = setInterval(nextSlide, config.autoplayDelay);
    }
  }
  
  function stopAutoplay() {
    clearInterval(intervalId);
  }
  
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  
  function initSlider() {
    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';
    currentSlide = 0;
    createSlides();
    startAutoplay();
  }
  
  initSlider();
  