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
