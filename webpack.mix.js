var mix = require('laravel-mix');
mix.setPublicPath('web/assets');


mix.disableNotifications();

// CUSTOM JS
mix.babel([
    'web/assets/babel/custom.js'
], 'web/assets/js/custom.js');

mix.js([
    'web/assets/babel/swipers.js',
], 'web/assets/js/swipers.js');

// CUSTOM CSS
mix.sass('web/assets/sass/custom.scss',    
    'web/assets/css/custom.css');


// VERSION
if (mix.inProduction()) {
    mix.version();
}
