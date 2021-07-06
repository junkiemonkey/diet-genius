import Swiper from 'swiper/bundle';
import Hammer from 'hammerjs';
import 'swiper/swiper.scss';
import "../scss/styles.scss";

(() => {
  const nextButton = document.querySelector('.jsNext');
  const prevButton = document.querySelector('.jsBack');
  const submitButton = document.querySelector('.jsSubmit');
  const form = document.querySelector('.jsQuizForm');
  const emailForm = document.querySelector('.jsEmailForm');
  const moreLink = document.querySelector('.jsMoreLink');
  const wrapper = document.querySelector('.wrapper');
  const menuToggle = document.querySelector('.jsMenuToggle');
  const nav = document.querySelector('.jsNav');
  const navClose = document.querySelector('.jsNavClose');
  const modal = document.querySelector('.jsModal');
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries()); 

  const isTouchDevice = 'ontouchstart' in window || 'onmsgesturechange' in window;

  const steps = new Swiper('.jsQuizSteps', {
    speed: 600,
    slidesPerView: "auto",
    spaceBetween: 36,
    centeredSlides: true,
    // centerInsufficientSlides: true,
    slideActiveClass: 'steps__slide--active',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
    allowTouchMove: false
  });
  
  const pages = new Swiper('.jsFormPages', {
    slidesPerView: 1,
    speed: 600,
    allowTouchMove: false,
    autoHeight: true,
    slideActiveClass: 'form__page--active',
    // effect: 'fade',
    // initialSlide: 5
  });

  if (params.complete) {
    modal.classList.add('modal--open');
  }

  if (isTouchDevice) {
    const mc = new Hammer.Manager(document.body, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]
      ]
    });
    mc.on('swipeup', e => {
      if (!wrapper.classList.contains('full')) wrapper.classList.add('full');
    });  
  } else {
    window.addEventListener('wheel', e => {
      if (e.deltaY > 0 && !wrapper.classList.contains('full')) {
        wrapper.classList.add('full');
      }
    })
  }
  
  modal.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.attributes['data-close']) {      
      modal.classList.remove('modal--open');
    }
  })

  moreLink?.addEventListener('click', e => {
    e.preventDefault();
    wrapper.classList.add('full');
  });

  menuToggle?.addEventListener('click', e => {
    e.preventDefault();
    nav?.classList.add('nav--open');
    document.body.style.overflow = 'hidden';
  });

  navClose?.addEventListener('click', e => {
    e.preventDefault();
    nav?.classList.remove('nav--open');
    document.body.style.overflow = null;
  }); 

  nextButton?.addEventListener('click', () => {
    steps.slideNext();
    pages.slideNext();
    prevButton.style.display = 'block';
    nextButton.disabled = isStepValid(pages.realIndex);
    if (steps.isEnd) {
      nextButton.style.display = "none";
      submitButton.style.display = "block";
      submitButton.disabled = isStepValid(pages.realIndex);
    }
  });

  prevButton?.addEventListener('click', () => {
    steps.slidePrev();
    pages.slidePrev();
    nextButton.disabled = isStepValid(pages.realIndex);
    submitButton.style.display = "none";
    nextButton.style.display = "block";
    if (steps.isBeginning) {
      prevButton.style.display = 'none';
    }
  });

  emailForm?.addEventListener('input', e => {
    if (e.target.value && /\S+@\S+\.\S+/.test(e.target.value)) {
      emailForm[1].disabled = false;
    } else {
      emailForm[1].disabled = true;
    }
  })

  form?.addEventListener('change', handleFormChange);
  form?.addEventListener('input', handleFormChange);

  form?.addEventListener('submit', e => {
    e.preventDefault();
    wrapper.classList.add('submitted');
  })

  function handleFormChange(e) {
    if (e.target.type === 'radio') {
      nextButton.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
    } else if (e.target.type === 'text') {
      if (e.target.attributes['data-number']) {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
      }
      if (e.target.value) {
        nextButton.removeAttribute('disabled');
      } else {
        nextButton.disabled = true;
      }
    }
  }

  function isStepValid(step) {
    const currentPage = pages.slides[step];
    const inputs = currentPage.querySelectorAll('input');
    let invalid = true;
    inputs.forEach(el => {
      if (
        (el.type === 'text' && el.value.length > 0) ||
        (el.type === 'radio' && el.checked)
      ) {
        invalid = false;
      }
    })
    
    return invalid;
  }


})();