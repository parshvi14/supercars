import { gsap } from 'gsap';
import { cars } from './data.js';

let currentIndex = 0;
const slider = document.querySelector('.slider');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

function createCarSlides() {
  cars.forEach((car, index) => {
    const slide = document.createElement('div');
    slide.className = 'car-slide';
    slide.dataset.index = index;
    slide.innerHTML = `
      <div class="car-slide__image-container">
        <img src="${car.image}" alt="${car.name}" class="car-slide__image">
      </div>
      <div class="car-slide__content">
        <div>
          <h2 class="car-slide__title">${car.name}</h2>
          <p class="car-slide__description">${car.description}</p>
          <ul class="car-slide__stats">
            ${Object.entries(car.stats).map(([label, value]) => `
              <li class="car-slide__stat">
                <span class="car-slide__stat-value">${value}</span>
                <span class="car-slide__stat-label">${label}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
    slider.appendChild(slide);
  });
}

function animateSlide(slide, reveal) {
  const tl = gsap.timeline({
    defaults: { duration: 1, ease: 'power3.inOut' },
    onComplete: () => {
      if (!reveal) {
        gsap.set(slide, { visibility: 'hidden' });
      }
    }
  });

  const image = slide.querySelector('.car-slide__image');
  const title = slide.querySelector('.car-slide__title');
  const description = slide.querySelector('.car-slide__description');
  const stats = slide.querySelectorAll('.car-slide__stat');

  if (reveal) {
    gsap.set(slide, { visibility: 'visible' });
  }

  tl.fromTo(image, 
    { scale: reveal ? 1.2 : 1 }, 
    { scale: reveal ? 1 : 1.2 }
  )
  .fromTo(title, 
    { y: reveal ? 50 : 0, opacity: reveal ? 0 : 1 }, 
    { y: 0, opacity: reveal ? 1 : 0 }, 
    "-=0.8"
  )
  .fromTo(description, 
    { y: reveal ? 40 : 0, opacity: reveal ? 0 : 1 }, 
    { y: 0, opacity: reveal ? 1 : 0 }, 
    "-=0.8"
  )
  .fromTo(stats, 
    { y: reveal ? 30 : 0, opacity: reveal ? 0 : 1 }, 
    { y: 0, opacity: reveal ? 1 : 0, stagger: reveal ? 0.1 : -0.1 }, 
    "-=0.8"
  );

  return tl;
}

function showCar(index) {
  const slides = document.querySelectorAll('.car-slide');
  const currentSlide = Array.from(slides).find(slide => slide.style.visibility === 'visible');
  const nextSlide = slides[index];

  if (currentSlide) {
    animateSlide(currentSlide, false);
  }
  
  setTimeout(() => {
      animateSlide(nextSlide, true);
  }, currentSlide ? 500 : 0);
}

function handleNext() {
  currentIndex = (currentIndex + 1) % cars.length;
  showCar(currentIndex);
}

function handlePrev() {
  currentIndex = (currentIndex - 1 + cars.length) % cars.length;
  showCar(currentIndex);
}

function init() {
  createCarSlides();
  showCar(currentIndex);
  nextButton.addEventListener('click', handleNext);
  prevButton.addEventListener('click', handlePrev);
}

init();
