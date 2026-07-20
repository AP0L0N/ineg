<?php
/**
 * Reviews and ratings module module for Craft CMS 3.x
 *
 * Module that handles all the logic regarding reviews and ratings of a product.
 *
 * @link      http://tilenpoje.eu
 * @copyright Copyright (c) 2020 Tilen Poje
 */

namespace modules\custommodule\controllers;

use Craft;
use craft\web\Controller;
use Exception;
use craft\elements\Entry;

/**
 * Review Controller
 *
 * Generally speaking, controllers are the middlemen between the front end of
 * the CP/website and your module’s services. They contain action methods which
 * handle individual tasks.
 *
 * A common pattern used throughout Craft involves a controller action gathering
 * post data, saving it on a model, passing the model off to a service, and then
 * responding to the request appropriately depending on the service method’s response.
 *
 * Action methods begin with the prefix “action”, followed by a description of what
 * the method does (for example, actionSaveIngredient()).
 *
 * https://craftcms.com/docs/plugins/controllers
 *
 * @author    Tilen Poje
 * @package   CustomModule
 * @since     1.0.0
 */
class UserController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ['price-calculation', 'contact'];

    public function actionPriceCalculation() {
        $user = Craft::$app->request->getBodyParam('user');
        $selectedService = Craft::$app->request->getBodyParam('selectedService');
        $selectedItems = Craft::$app->request->getBodyParam('selectedItems');
        $price = Craft::$app->request->getBodyParam('price');

        // Initialize an empty string to hold the HTML
        $htmlString = '';

        // Iterate over the associative array
        foreach ($selectedItems as $key => $value) {
            $htmlString .= "<p><strong>{$key}:</strong> {$value['vrsta']} + {$value['cena']}€ /m2</p>";
        }

        $htmlString .= "<p><strong>Delo:</strong> {$selectedService['cenaDelo']}€ /m2</p>";

        $section = Craft::$app->sections->getSectionByHandle('povprasevanja');

        $entry = new Entry();
        $entry->sectionId = $section->id;
        $entry->typeId = $section->id;
        $entry->authorId = 1;
        $entry->enabled = true;
        $entry->setFieldValues([
            'uporabnikImeInPriimek' => $user['name'],
            'uporabnikEmail' => $user['email'],
            'uporabnikOpombe' => $user['notes'],
            'izbranaStoritev' => [$selectedService['storitev']['id']],
            'postavke' => $htmlString,
            'prikazanaOkvirnaCena' => $price . '€ m/2'
        ]);
        $success = Craft::$app->elements->saveElement($entry);

        if ($success) {
            return $this->asJson(['success' => true]);
        } else {
            return $this->asJson(['success' => false]);
        }
    }

    public function actionContact() {
        $request = Craft::$app->getRequest();

        $name = $request->getBodyParam('name');
        $phone = $request->getBodyParam('phone');
        $email = $request->getBodyParam('email');
        $type = $request->getBodyParam('type');
        $message = $request->getBodyParam('message');

        $section = Craft::$app->sections->getSectionByHandle('povprasevanja');

        $entry = new Entry();
        $entry->sectionId = $section->id;
        $entry->typeId = $section->getEntryTypes()[0]->id;
        $entry->authorId = 1;
        $entry->enabled = true;
        $entry->setFieldValues([
            'uporabnikImeInPriimek' => $name,
            'uporabnikEmail' => $email,
            'uporabnikOpombe' => $message . "\n\nTelefon: " . $phone . "\nVrsta povpraševanja: " . $type,
            'postavke' => '<p><strong>Vrsta povpraševanja:</strong> ' . $type . '</p><p><strong>Telefon:</strong> ' . $phone . '</p>',
        ]);

        $success = Craft::$app->elements->saveElement($entry);

        if ($success) {
            return $this->asJson(['success' => true]);
        }

        return $this->asJson(['success' => false]);
    }
}
