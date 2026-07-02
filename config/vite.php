<?php
/**
 * Vite plugin for Craft CMS
 *
 * Only the settings that differ from the plugin's defaults are listed here.
 * See vendor/nystudio107/craft-vite/src/config.php for the full list of options.
 */

use craft\helpers\App;

return [
    // Use the Vite dev server (with HMR) when running locally in DDEV
    'useDevServer' => App::env('ENVIRONMENT') === 'dev' || App::env('CRAFT_ENVIRONMENT') === 'dev',

    // Where the production manifest.json lives (vite.config.js forces this flat path)
    'manifestPath' => '@webroot/dist/manifest.json',

    // Public URL to the assets when NOT using the dev server
    'serverPublic' => App::env('PRIMARY_SITE_URL') . '/dist/',

    // Public URL to the Vite dev server, as seen from the browser (DDEV: same host, port 3000)
    'devServerPublic' => preg_replace('/:\d+$/', '', App::env('PRIMARY_SITE_URL')) . ':3000',

    // Internal URL to the dev server, as seen from PHP running inside the DDEV web container
    'devServerInternal' => 'http://localhost:3000',

    // Ping devServerInternal to confirm the dev server is actually running before using it
    'checkDevServer' => true,
];
