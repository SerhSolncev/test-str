import "./content/css/main.css";
import "./content/scss/main.scss";

import Swiper from 'swiper';
import { Navigation, Pagination} from 'swiper/modules';
import LazyLoad from 'vanilla-lazyload'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

document.addEventListener('DOMContentLoaded', (event) => {
  document.body.classList.add('loading');

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 400)

  // "modernizr" func"
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }

  if(!isTouchDevice()) {
    document.body.classList.add('desktop-device')
  }

  const getElement = (context, selector) => {
    if (!context && !selector) {
      return null;
    }

    return context.querySelector(selector);
  };

  // lazy-load
  let lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  });

  const mutationObserver = new MutationObserver(() => {
    lazyLoadInstance.update();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  const initListSlider = (el) => {
    if (el.dataset.slider !== 'list-slider') return;

    const swiperContainer = el.querySelector('.swiper');

    if (!swiperContainer || swiperContainer.classList.contains('swiper-initialized')) return;

    new Swiper(swiperContainer, {
      modules: [Navigation, Pagination],
      freeMode: false,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      simulateTouch: true,
      autoHeight: true,
      observer: true,
      observeParents: true,
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNextAmount: 2,
        loadPrevNext: true
      },
      loop: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      followFinger: true,
      spaceBetween: 20,
      navigation: {
        nextEl: el.querySelector('.js-next-swiper'),
        prevEl: el.querySelector('.js-prev-swiper'),
        disabledClass: 'swiper-lock'
      },
      // pagination: {
      //   el: el.querySelector('.swiper-pagination'),
      //   clickable: true
      // },
      breakpoints: {
        0: {
          slidesPerView: 1.6,
          slidesPerGroup: 1,
          spaceBetween: 40
        },
        768: {
          slidesPerView: 2.52,
          slidesPerGroup: 1,
          spaceBetween: 40
        },
        992: {
          slidesPerView: 2.5,
          slidesPerGroup: 1,
          spaceBetween: 60,
        },
        1200: {
          slidesPerView: 2.5,
          slidesPerGroup: 1,
          spaceBetween: 92,
        }
      },
    });
  };

  document.querySelectorAll('[data-slider="list-slider"]').forEach(initListSlider);

  const observerBannersSlider = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        if (node.matches?.('[data-slider="list-slider"]')) {
          initListSlider(node);
        }

        const innerSliders = node.querySelectorAll?.('[data-slider="list-slider"]');
        innerSliders?.forEach(initListSlider);
      });
    }
  });

  observerBannersSlider.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // gsap

  const showElementYX = document.querySelectorAll('.js-light-show');

  if (showElementYX.length > 0) {
    gsap.registerPlugin(ScrollTrigger);

    showElementYX.forEach((element) => {
      const delay = parseFloat(element.dataset.delay) || 0.25;
      const duration = parseFloat(element.dataset.duration) || 0.5;
      const x = element.dataset.showX ? parseFloat(element.dataset.showX) || 0 : null;
      const y = element.dataset.showY ? parseFloat(element.dataset.showY) || 0 : null;
      const z = element.dataset.showZ ? parseFloat(element.dataset.showZ) || 0.9 : null;
      const rotate = element.dataset.rotate ? parseFloat(element.dataset.rotate) || 0 : null;
      const start = element.dataset.start || 'top 90%';
      const end = element.dataset.end || 'top 50%';

      const from = { opacity: 0 };
      if (x !== null) from.x = x;
      if (y !== null) from.y = y;
      if (z !== null) from.scale = z;
      if (rotate !== null) from.rotate = rotate;

      const to = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: duration, delay: delay };

      gsap.fromTo(
        element,
        from,
        {
          ...to,
          scrollTrigger: {
            trigger: element,
            start: start,
            end: end,
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  const animatedBlocks = document.querySelectorAll(".js-animated-text");

  animatedBlocks.forEach(block => {
    const startColor = block.dataset.startColor || "#aaa";
    const endColor = block.dataset.endColor || "#000";
    const start = block.dataset.start || "top 85%";
    const end = block.dataset.end || "bottom 55%";

    const html = block.innerHTML.trim();
    block.innerHTML = "";

    const temp = document.createElement("div");
    temp.innerHTML = html;

    function processNode(node, parent) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(" ");
        words.forEach((word, wordIndex) => {
          if (!word) return;

          const wordSpan = document.createElement("span");
          wordSpan.classList.add("js-animated-word");
          parent.appendChild(wordSpan);

          [...word].forEach(char => {
            const charSpan = document.createElement("span");
            charSpan.classList.add("js-animate-symbol");
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
          });

          if (wordIndex < words.length - 1) {
            parent.appendChild(document.createTextNode(" "));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {

        const clone = document.createElement(node.tagName.toLowerCase());
        [...node.attributes].forEach(attr => {
          clone.setAttribute(attr.name, attr.value);
        });
        parent.appendChild(clone);

        node.childNodes.forEach(child => processNode(child, clone));
      }
    }

    temp.childNodes.forEach(node => processNode(node, block));

    const wordsEls = block.querySelectorAll(".js-animated-word");

    gsap.set(block.querySelectorAll(".js-animate-symbol"), {
      display: "inline-block",
      opacity: 0,
      y: 30,
      color: startColor
    });

    const symbols = block.querySelectorAll(".js-animate-symbol");

    gsap.set(symbols, {
      display: "inline-block",
      opacity: 0,
      y: 30,
      color: startColor
    });

    wordsEls.forEach((word) => {
      gsap.to(word, {
        opacity: 1,
        y: 0,
        color: endColor,
        duration: 0.1,
        ease: "power3.out",
        onComplete: () => {
          // если слово находится внутри .title-block__bg
          const bgParent = word.closest(".title-block__bg");
          if (bgParent) {
            bgParent.classList.add("showed");
          }
        }
      }, ">");
    });

    gsap.to(symbols, {
      scrollTrigger: {
        trigger: block,
        start: start,
        end: end,
        scrub: true,
        once: true
      },
      opacity: 1,
      y: 0,
      color: endColor,
      stagger: {
        each: 0.3,
        from: "start"
      },
      ease: "power3.out"
    });


  });


  // навігація

  const headerFixed = document.querySelector('.js-fixed-header');
  const mobMenu = document.querySelector('.mobile-menu');
  let headerFixedHeight = headerFixed.offsetHeight;

  document.querySelectorAll('.js-nav-anchor').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      mobMenu.classList.remove('is-open');
      document.body.classList.remove('overflow-hidden');
      const currentHref = this.getAttribute('href');

      document.querySelectorAll('.js-nav-anchor').forEach(btn => {
        btn.classList.toggle('is-current', btn.getAttribute('href') === currentHref);
      });

      let target = document.querySelector(currentHref);

      if (target) {
        if (target.getAttribute('href') === 'top') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          document.querySelectorAll('.js-nav-anchor').forEach(link => {
            link.classList.remove('is-current');
          });
          document.querySelector('.js-nav-anchor#top').classList.add('is-current');
        } else {
          setTimeout(() => {
            window.scrollTo({
              top: target.offsetTop - headerFixedHeight - 40,
              behavior: 'smooth'
            });
          }, 50);
        }
      }
    });
  });

  const observerSec = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        document.querySelectorAll('.js-nav-anchor').forEach(link => {
          link.classList.toggle('is-current', link.getAttribute('href') === id);
        });
      }
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.3 });

  document.querySelectorAll('.js-anchor-block').forEach(el => observerSec.observe(el));

  const resizeObserver = new ResizeObserver(() => {
    document.querySelectorAll('.js-anchor-block').forEach(el => {
      observerSec.unobserve(el);
      observerSec.observe(el);
    });
  });

  document.querySelectorAll('.js-anchor-block').forEach(anchor => resizeObserver.observe(anchor));

  const header = document.querySelector('.js-header');
  let headerHeight = header.offsetHeight;

  window.addEventListener('scroll', function () {

    if (window.scrollY > headerHeight) {
      headerFixed.classList.add('onscroll');
    } else {
      headerFixed.classList.remove('onscroll');
    }
  });

  // lightbox
  let lightbox;

  function initGLightbox() {
    if (lightbox) {
      lightbox.destroy();
    }

    lightbox = GLightbox({
      selector: '.js-glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

  initGLightbox();

  const observerLightBox = new MutationObserver(mutations => {
    let shouldReinit = false;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && node.querySelector('.glightbox')) {
          shouldReinit = true;
          break;
        }
      }

      if (shouldReinit) break;
    }

    if (shouldReinit) {
      initGLightbox();
    }
  });

  observerLightBox.observe(document.body, {
    childList: true,
    subtree: true
  });


  // menu

  const toggleButtons = document.querySelectorAll('.js-toggle-open');
  const toggleBlocks = document.querySelectorAll('.js-toggle-block');
  const backButtons = document.querySelectorAll('.js-toggle-back');

  toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = button.dataset.id;
      const targetBlock = document.querySelector(`.js-toggle-block[data-id="${id}"]`);
      const backButton = document.querySelector(`.js-toggle-back[data-id="${id}"]`);

      if (!targetBlock) return;

      const isOpen = targetBlock.classList.contains('is-open');

      toggleBlocks.forEach(block => block.classList.remove('is-open'));
      backButtons.forEach(back => back.classList.remove('show'));

      if (!isOpen) {
        targetBlock.classList.add('is-open');
        if (backButton) backButton.classList.add('show');
      }

      if(backButton) {
        document.body.style.overflow = 'hidden';
      }

    });
  });

  toggleBlocks.forEach(block => {
    const closeBtns = block.querySelectorAll('.js-toggle-close');
    if (closeBtns.length) {
      closeBtns.forEach((close) => {
        close.addEventListener('click', (e) => {
          e.stopPropagation();
          block.classList.remove('is-open');
          const id = block.dataset.id;
          const backButton = document.querySelector(`.js-toggle-back[data-id="${id}"]`);
          if (backButton) backButton.classList.remove('show');
          document.body.style.overflow = '';
        });
      });
    }
  });

  backButtons.forEach(back => {
    back.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = back.dataset.id;
      const targetBlock = document.querySelector(`.js-toggle-block[data-id="${id}"]`);
      if (targetBlock) targetBlock.classList.remove('is-open');
      back.classList.remove('show');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    toggleBlocks.forEach(block => {
      if (!block.contains(e.target)) {
        block.classList.remove('is-open');
        const id = block.dataset.id;
        const backButton = document.querySelector(`.js-toggle-back[data-id="${id}"]`);
        if (backButton) backButton.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  });
})
