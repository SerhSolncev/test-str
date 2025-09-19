import "./content/css/main.css";
import "./content/scss/main.scss";

import Swiper from 'swiper';
import { Navigation, Pagination} from 'swiper/modules';
import LazyLoad from 'vanilla-lazyload'

document.addEventListener('DOMContentLoaded', (event) => {
  document.body.classList.add('loading');

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500)

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
    if (el.dataset.slider !== 'banner-slider') return;

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
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: false,
      slidesPerView: 1,
      slidesPerGroup: 1,
      followFinger: true,
      spaceBetween: 20,
      navigation: {
        nextEl: el.querySelector('.js-next-swiper'),
        prevEl: el.querySelector('.js-prev-swiper'),
        disabledClass: 'swiper-lock'
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true
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


  // навігація

  const header = document.querySelector('header');
  // let headerHeight = header.offsetHeight;

  document.querySelectorAll('.js-nav-anchor').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      // mobMenu.classList.remove('show');
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
              top: target.offsetTop - 40,
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
})
