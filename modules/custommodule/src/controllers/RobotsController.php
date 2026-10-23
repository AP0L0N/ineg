<?php

namespace modules\custommodule\controllers;

use Craft;
use craft\web\Controller;
use modules\custommodule\CustomModule;

/**
 * Per-host robots.txt.
 *
 * ineg.si (production) and ineg.tilenpoje.eu (preview) share one install that runs
 * with ENVIRONMENT=staging, so the SEO plugin's robots.txt would say "Disallow: /"
 * on both. Production hosts get an indexable robots.txt; every other host falls
 * through to the SEO plugin (which keeps the preview at "Disallow: /").
 */
class RobotsController extends Controller
{
    protected $allowAnonymous = ['index'];

    public function actionIndex()
    {
        if (!CustomModule::isProductionHost()) {
            return Craft::$app->runAction('seo/seo/robots');
        }

        $host = Craft::$app->getRequest()->getHostName();
        Craft::$app->getResponse()->getHeaders()->set('Content-Type', 'text/plain; charset=UTF-8');

        return $this->asRaw(
            "Sitemap: https://{$host}/sitemap.xml\n\n" .
            "User-agent: *\n" .
            "Allow: /\n" .
            "Disallow: /cpresources/\n"
        );
    }
}
