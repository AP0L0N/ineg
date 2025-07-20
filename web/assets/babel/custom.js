
document.addEventListener('DOMContentLoaded', function () {

	let navSwipers = document.querySelectorAll('.nav-swiper');
    Array.prototype.forEach.call(navSwipers, function (navSwiper) {
		const swiper = new Swiper(navSwiper, {
			speed: 400,
			spaceBetween: 100,
            slidesPerView: 'auto',
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
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
});