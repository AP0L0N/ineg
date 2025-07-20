<?php

namespace modules\custommodule\twig;

use craft;
use craft\elements\Entry;
use craft\helpers\UrlHelper;
use Twig\Extension\AbstractExtension;
use Twig\Extension\ExtensionInterface;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Yii;

class Extension extends AbstractExtension implements ExtensionInterface
{
    public function getFilters()
    {
        return [
            new TwigFilter('file_exists', [$this, 'fileExists']),
        ];
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('contactInformation', [$this, 'contactInformation']),
        ];
    }

    /**
     * Return true if local file exists.
     */
    public function fileExists($assetOrPath)
    {
        if (is_null($assetOrPath)) {
            return false;
        }

        if (is_string($assetOrPath) && !empty($assetOrPath)) {
            $path = $assetOrPath;

            if (file_exists(join('/', [".", $path]))) {
                return true;
            } else {
                return false;
            }
        } else {
            $url = $assetOrPath->url;

            if (is_null($url)) {
                $volumePath = $assetOrPath->getVolume()->settings['path'];
                $folderPath = $assetOrPath->getFolder()->path;
                $url = Yii::getAlias($volumePath) . $folderPath . "/" . $assetOrPath->filename;
            }

            if (!empty($url) && (file_exists(join('/', [".", parse_url($url, PHP_URL_PATH)])) || file_exists($url))) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Return contact information (from globals) in a simple key => value format.
     */
    public function contactInformation(): array
    {
        $fields = [];
        $contactInformation = craft::$app->globals->getSetByHandle('contactInformation')->contacts->all();

        foreach ($contactInformation as $block) {
            foreach ($block->getFieldLayout()->getCustomFields() as $field) {
                $fields[$field->handle] = $block->{$field->handle};
            }
        }

        return $fields;
    }
}