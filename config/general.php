<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

return [
    // Global settings
    '*' => [
        // Default Week Start Day (0 = Sunday, 1 = Monday...)
        'defaultWeekStartDay' => 1,

        // Whether generated URLs should omit "index.php"
        'omitScriptNameInUrls' => true,

        // Control Panel trigger word
        'cpTrigger' => 'admin',

        // The secure key Craft will use for hashing and encrypting data
        'securityKey' => getenv('SECURITY_KEY'),

        // Whether to save the project config out to config/project.yaml
        // (see https://docs.craftcms.com/v3/project-config.html)
        'useProjectConfigFile' => true,

        'enableCsrfProtection' => false
    ],

    'aliases' => [
        '@web' => getenv('DEFAULT_SITE_URL'),
    ],

    // Dev environment settings
    'dev' => [
        'devMode' => true,
	'allowAdminChanges' => true,
    ],

    // Staging environment settings
    'staging' => [
        // devMode can be switched off via CRAFT_DEV_MODE=false in .env (ineg.si production
        // shares this install and runs as 'staging'); defaults to true when unset.
        'devMode' => getenv('CRAFT_DEV_MODE') === false ? true : filter_var(getenv('CRAFT_DEV_MODE'), FILTER_VALIDATE_BOOLEAN),
        'allowAdminChanges' => false,
    ],

    // Production environment settings
    'production' => [
	'devMode' => false,
        'allowAdminChanges' => false,
    ],
];
