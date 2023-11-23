'use strict';

const modalWindow = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.getElementById('section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('.nav__link');
const logo = document.querySelector('.nav__logo');

const btnShowModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnRegisterForm = document.querySelector('.btn');
const btnScroll = document.querySelector('.btn--scroll-to');

////MODAL WINDOW///
btnShowModal.forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    modalWindow.classList.remove('hidden');
    overlay.classList.remove('hidden');
  });
});

btnCloseModal.addEventListener('click', function (e) {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    modalWindow.classList.add('hidden');
    overlay.classList.add('hidden');
  }
});
////SCROLLING//
btnScroll.addEventListener('click', function (e) {
  e.preventDefault();
  //Cach khac: Move top of element to top of viewport
  section1.scrollIntoView({ behavior: 'smooth' });
  //const s1coords = section1.getBoundingClientRect();

  //console.log(e.target.getBoundingClientRect());
  //console.log(
  //  'width/height viewport:',
  //  document.documentElement.clientWidth,
  //  document.documentElement.clientHeight
  //);

  //Determine position of current section1 to viewport
  //console.log(s1coords.left, s1coords.top);

  //Determine distance scrolled per X/Y
  //console.log(window.scrollX, window.scrollY);

  //Scroll section1 to top of viewport //cach cu
  //  window.scrollTo({
  //    top: s1coords.top + window.scrollY,
  //    left: s1coords.left + window.scrollX,
  //    behavior: 'smooth',
  //    //behavior: 'instant',
  //    //behavior: 'auto',
  //  })
});
////PAGE NAVIGATION///
//ung dung bubbling phase: event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////TABBED COMPONENT///

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //De-active
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');

  //console.log(clicked.dataset.tab);//cach khac get data-tab
  //console.log(clicked.getAttribute('data-tab'));
});

////MENU FADE ANIMATION///
/* 
nav.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link')) {
    links.forEach(li => {
      if (li !== e.target) {
        li.style.opacity = 0.5;
        logo.style.opacity = 0.5;
      }
    });
  }
});

nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    links.forEach(li => {
      if (li !== e.target) {
        li.style.opacity = 1;
        logo.style.opacity = 1;
      }
    });
  }
});
 */
//Refactory 1 (kho)

const navHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    links.forEach(li => {
      if (li !== e.target) {
        //console.log(this);
        li.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

//Passing 'argument' into handler

nav.addEventListener('mouseover', navHover.bind(0.5));
nav.addEventListener('mouseout', navHover.bind(1));

////STICKY NAV: INTERSECTION OBSERVER API
/* 
const obCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obOption = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obCallback, obOption);
observer.observe(section1);
 */
const header = document.querySelector('.header');
const heightNav = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const obsHeader = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${heightNav}px`,
});

obsHeader.observe(header);

////REVEAL SECTION///
const sectionsEle = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  obsSection.unobserve(entry.target);
};

const obsSection = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sectionsEle.forEach(section => {
  obsSection.observe(section);
  section.classList.add('section--hidden');
});

////LAZY-LOADING IMAGES
const images = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserve = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

images.forEach(img => imgObserve.observe(img));

////SLIDER///
const slider = function () {
  const slide = document.querySelectorAll('.slide');
  const btnSliderRight = document.querySelector('.slider__btn--right');
  const btnSliderLeft = document.querySelector('.slider__btn--left');
  const sldr = document.querySelector('.slider');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slide.length;

  //Function
  const createDots = function () {
    slide.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activeDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (curSlide) {
    slide.forEach((img, i) => {
      img.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  const preSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activeDots(0);
  };
  init();

  //Event handlers
  btnSliderRight.addEventListener('click', nextSlide);
  btnSliderLeft.addEventListener('click', preSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && preSlide();
  });

  //Bubbling event
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      activeDots(slide);
      goToSlide(slide);
    }
  });
};
slider();
