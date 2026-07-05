import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

document.addEventListener('DOMContentLoaded', () => {

    let galleries = document.querySelectorAll('.pswp-gallery');
    if (!galleries.length) return;

    const lightbox = new PhotoSwipeLightbox({
        gallery: '.pswp-gallery',
        children: 'a',
        pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

});
