<?php
/**
 * Custom module module for Craft CMS 3.x
 *
 * Module that handles custom actions.
 *
 * @link      http://tilenpoje.eu
 * @copyright Copyright (c) 2022 Tilen Poje
 */

namespace modules\custommodule;

use Craft;
use craft\events\RegisterTemplateRootsEvent;
use craft\i18n\PhpMessageSource;
use craft\console\Application as ConsoleApplication;
use craft\web\View;
use craft\web\UrlManager;
use craft\events\RegisterUrlRulesEvent;
use craft\services\Plugins;
use yii\base\Application as YiiApplication;
use modules\custommodule\twig\Extension;

use Twig\Extra\String\StringExtension;
use yii\base\Event;
use yii\base\Module;
use craft\events\RegisterCpNavItemsEvent;
use craft\web\twig\variables\Cp;

/**
 * Craft plugins are very much like little applications in and of themselves. We’ve made
 * it as simple as we can, but the training wheels are off. A little prior knowledge is
 * going to be required to write a plugin.
 *
 * For the purposes of the plugin docs, we’re going to assume that you know PHP and SQL,
 * as well as some semi-advanced concepts like object-oriented programming and PHP namespaces.
 *
 * https://craftcms.com/docs/plugins/introduction
 *
 * @author    Tilen Poje
 * @package   CustomModule
 * @since     1.0.0
 *
 */
class CustomModule extends Module
{

    // Static Properties
    // =========================================================================

    /**
     * Static property that is an instance of this module class so that it can be accessed via
     * CustomModule::$instance
     *
     * @var CustomModule
     */
    public static $instance;

    /**
     * Hosts that are the public production site. ineg.tilenpoje.eu (preview) shares
     * this install and must stay non-indexable.
     */
    const PRODUCTION_HOSTS = ['ineg.si', 'www.ineg.si'];

    public static function isProductionHost(): bool
    {
        $request = Craft::$app->getRequest();
        if ($request->getIsConsoleRequest()) {
            return false;
        }
        return in_array(strtolower((string)$request->getHostName()), self::PRODUCTION_HOSTS, true);
    }

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function __construct($id, $parent = null, array $config = [])
    {
        Craft::setAlias('@modules/custommodule', $this->getBasePath());
        $this->controllerNamespace = 'modules\custommodule\controllers';

        // Console
        if (Craft::$app instanceof ConsoleApplication) {
            $this->controllerNamespace = 'modules\custommodule\console\controllers';
        }

        // Translation category
        $i18n = Craft::$app->getI18n();
        /** @noinspection UnSafeIsSetOverArrayInspection */
        if (!isset($i18n->translations[$id]) && !isset($i18n->translations[$id.'*'])) {
            $i18n->translations[$id] = [
                'class' => PhpMessageSource::class,
                'sourceLanguage' => 'en-US',
                'basePath' => '@modules/custommodule/translations',
                'forceTranslation' => true,
                'allowOverrides' => true,
            ];
        }

        // Base template directory
        Event::on(View::class, View::EVENT_REGISTER_CP_TEMPLATE_ROOTS, function (RegisterTemplateRootsEvent $e) {
            if (is_dir($baseDir = $this->getBasePath().DIRECTORY_SEPARATOR.'templates')) {
                $e->roots[$this->id] = $baseDir;
            }
        });

        // Set this as the global instance of this module class
        static::setInstance($this);

        parent::__construct($id, $parent, $config);
    }

    /**
     * Set our $instance static property to this class so that it can be accessed via
     * CustomModule::$instance
     *
     * Called after the module class is instantiated; do any one-time initialization
     * here such as hooks and events.
     *
     * If you have a '/vendor/autoload.php' file, it will be loaded for you automatically;
     * you do not need to load it in your init() method.
     *
     */
    public function init()
    {
        parent::init();
        self::$instance = $this;

        Craft::info(
            Craft::t(
                'custom-module',
                '{name} module loaded',
                ['name' => 'Custom module']
            ),
            __METHOD__
        );

        // Register Twig extensions
        Craft::$app->view->registerTwigExtension(new Extension());

        // Per-host indexing (see RobotsController). Registered after plugins load so
        // these handlers run after the SEO plugin's own (robots.txt rule, X-Robots-Tag).
        if (!Craft::$app->getRequest()->getIsConsoleRequest()) {
            $registerIndexing = function () {
                Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_SITE_URL_RULES, function (RegisterUrlRulesEvent $e) {
                    $e->rules['robots.txt'] = 'custom-module/robots/index';
                });

                // Class-level on yii\base\Application: runs after the SEO plugin's handler,
                // which is attached to the concrete craft\web\Application class.
                Event::on(YiiApplication::class, YiiApplication::EVENT_AFTER_REQUEST, function () {
                    $request = Craft::$app->getRequest();
                    if (!$request->getIsSiteRequest() || !self::isProductionHost()) {
                        return;
                    }
                    // The SEO plugin forces "none, noimageindex" whenever ENVIRONMENT
                    // is not 'production'; drop that forced value on the production host.
                    $headers = Craft::$app->getResponse()->getHeaders();
                    $values = array_filter(
                        (array)$headers->get('x-robots-tag', [], false),
                        function ($v) { return trim($v) !== 'none, noimageindex'; }
                    );
                    $headers->remove('x-robots-tag');
                    foreach ($values as $v) {
                        $headers->add('x-robots-tag', $v);
                    }
                });
            };
            if (Craft::$app->getPlugins()->arePluginsLoaded()) {
                $registerIndexing();
            } else {
                Event::on(Plugins::class, Plugins::EVENT_AFTER_LOAD_PLUGINS, $registerIndexing);
            }
        }

        Event::on(
            View::class, 
            View::EVENT_REGISTER_SITE_TEMPLATE_ROOTS, 
            function (RegisterTemplateRootsEvent $event) {
            $event->roots['_views'] = __DIR__ . '/templates';
        });
        
        parent::init();
    }

    // Protected Methods
    // =========================================================================
}
