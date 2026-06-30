import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation, Scrollbar, EffectFade } from "swiper/modules";

document.addEventListener('DOMContentLoaded', () => {

    Swiper.prototype.toggleControls = function() {
        let allSlidesVisible = this.slides.length <= (this.params.slidesPerView == 'auto' ? 1 : this.params.slidesPerView);
        let elementDisplay = allSlidesVisible ? 'none' : 'flex';

        if (this.pagination && this.pagination.el) this.pagination.el.style.display = elementDisplay;
        if (this.navigation && this.navigation.nextEl[0]) this.navigation.nextEl[0].style.display = elementDisplay;
        if (this.navigation && this.navigation.prevEl[0]) this.navigation.prevEl[0].style.display = elementDisplay;
    };

    let navSwipers = document.querySelectorAll('.service-item-slider .swiper');
    Array.prototype.forEach.call(navSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Scrollbar, Autoplay],
            slidesPerView: 1,
            autoplay: true,
            loop: true,
            speed: 400,
            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true,
            },
        });
    });

    let heroSwipers = document.querySelectorAll('.hero-slider .swiper');
    Array.prototype.forEach.call(heroSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Pagination, EffectFade, Autoplay],
            slidesPerView: 1,
            loop: true,
            effect: 'fade',
            autoplay: {
                delay: 5000
            },
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    });

    let imageWithTextSwipers = document.querySelectorAll('.image-with-text .swiper');
    Array.prototype.forEach.call(imageWithTextSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Pagination, EffectFade, Autoplay],
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 3000
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    });

    let partnersSectionSwipers = document.querySelectorAll('.partners-section .swiper');
    Array.prototype.forEach.call(partnersSectionSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Pagination, Autoplay],
            slidesPerView: 'auto',
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    });

    // 2026 redesign — hero slider
    let heroDeckingSwipers = document.querySelectorAll('.hero-decking .swiper');
    Array.prototype.forEach.call(heroDeckingSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Pagination, EffectFade, Autoplay],
            slidesPerView: 1,
            loop: true,
            effect: 'fade',
            speed: 800,
            autoplay: {
                delay: 6000
            },
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    });

    // 2026 redesign — wood species cards
    let woodSpeciesSwipers = document.querySelectorAll('.wood-species .swiper');
    Array.prototype.forEach.call(woodSpeciesSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Pagination, Autoplay],
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            breakpoints: {
                576: { slidesPerView: 2 },
                991: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    });

    // 2026 redesign — testimonials
    let testimonialsSwipers = document.querySelectorAll('.testimonials-slider .swiper');
    Array.prototype.forEach.call(testimonialsSwipers, function (swiper) {
        new Swiper(swiper, {
            modules: [Pagination, Autoplay],
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                991: { slidesPerView: 3 }
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    });

});
