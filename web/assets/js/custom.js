document.addEventListener('DOMContentLoaded', function () {
  var navSwipers = document.querySelectorAll('.nav-swiper');
  Array.prototype.forEach.call(navSwipers, function (navSwiper) {
    var swiper = new Swiper(navSwiper, {
      speed: 400,
      spaceBetween: 100,
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets'
      }
    });
  });
  $('.main-slider').slick({
    arrows: false,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 3000
  });
  $('.slick-gallery').slick({
    arrows: false,
    dots: true,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 2000,
    responsive: [{
      breakpoint: 768,
      settings: {
        autoplay: true,
        autoplaySpeed: 3000
      }
    }]
  });
  jQuery('.block-slider').slick({
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    adaptiveHeight: true,
    dots: true,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }]
  });
  $('.slick-gallery-2').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    dots: true,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 2
      }
    }]
  });
  $('.match-height-by-row').matchHeight({
    byRow: true
  });

  // 2026 redesign — FAQ accordion
  var faqItems = document.querySelectorAll('.faq-accordion .faq-item');
  Array.prototype.forEach.call(faqItems, function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Close all items in the same list (one open at a time)
      var list = item.closest('.faq-list');
      if (list) {
        Array.prototype.forEach.call(list.querySelectorAll('.faq-item'), function (other) {
          other.classList.remove('is-open');
          var otherQuestion = other.querySelector('.faq-question');
          var otherAnswer = other.querySelector('.faq-answer');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });
      }
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 2026 redesign — animated counters
  var counters = document.querySelectorAll('.stats-bar .counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var animateCounter = function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var duration = 1600;
      var start = null;
      var step = function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toString();
        }
      };
      window.requestAnimationFrame(step);
    };
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4
    });
    Array.prototype.forEach.call(counters, function (counter) {
      observer.observe(counter);
    });
  }

  // 2026 redesign — header (search overlay, jezikovni izbirnik, višina glave, senca ob drsenju)
  var header = document.getElementById('mainHeader');
  if (header) {
    var setHeaderHeight = function setHeaderHeight() {
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    window.addEventListener('load', setHeaderHeight);

    // Senca ob drsenju
    var onScroll = function onScroll() {
      header.classList.toggle('is-scrolled', window.pageYOffset > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });

    // Iskalna plast
    var searchOverlay = document.getElementById('searchOverlay');
    var searchToggles = document.querySelectorAll('.search-toggle');
    var searchClose = searchOverlay ? searchOverlay.querySelector('.search-close') : null;
    var searchInput = searchOverlay ? searchOverlay.querySelector('.search-input') : null;
    var closeSearch = function closeSearch() {
      if (!searchOverlay) return;
      searchOverlay.classList.remove('is-active');
      searchOverlay.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(searchToggles, function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    };
    Array.prototype.forEach.call(searchToggles, function (toggle) {
      toggle.addEventListener('click', function () {
        if (!searchOverlay) return;
        var willOpen = !searchOverlay.classList.contains('is-active');
        searchOverlay.classList.toggle('is-active', willOpen);
        searchOverlay.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
        Array.prototype.forEach.call(searchToggles, function (t) {
          t.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
        if (willOpen && searchInput) {
          setHeaderHeight();
          searchInput.focus();
        }
      });
    });
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Jezikovni izbirnik
    var langSelector = document.querySelector('.lang-selector');
    var langToggle = langSelector ? langSelector.querySelector('.lang-toggle') : null;
    if (langToggle) {
      langToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = !langSelector.classList.contains('is-open');
        langSelector.classList.toggle('is-open', willOpen);
        langToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    // Zapiranje ob kliku zunaj / tipki Esc
    document.addEventListener('click', function (e) {
      if (langSelector && !langSelector.contains(e.target)) {
        langSelector.classList.remove('is-open');
        if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeSearch();
        if (langSelector) {
          langSelector.classList.remove('is-open');
          if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
});
