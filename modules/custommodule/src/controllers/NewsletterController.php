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
class NewsletterController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ['subscription'];

    public function actionSubscription() {
        $email = Craft::$app->request->getBodyParam('email');
        $list_id = (int) Craft::$app->request->getBodyParam('list_id');

        $listIds = [$list_id];
        $contact = null;
        $config = \SendinBlue\Client\Configuration::getDefaultConfiguration()->setApiKey('api-key', getenv('SENDINBLUE_API3_KEY'));
        $apiInstance = new \SendinBlue\Client\Api\ContactsApi(new \GuzzleHttp\Client(), $config);
        
        try {
            $contact = $apiInstance->getContactInfo($email);
        } catch (\Exception $e) {
        }
        
        try {

            if($contact) {
                $contactEmails = new \SendinBlue\Client\Model\AddContactToList([
                    "emails" => [$contact["email"]]
                ]);

                if(empty($listIds)) {
                    $apiInstance->addContactToList(39, $contactEmails);
                } else {

                    foreach($listIds as $id) {
                        $apiInstance->addContactToList($id, $contactEmails);
                    }
                }

            } else {
                $createContact = new \SendinBlue\Client\Model\CreateContact();
                $createContact->setEmail($email);
                $createContact->setListIds(empty($listIds) ? [39] : $listIds);
                $contact = $apiInstance->createContact($createContact);
            }

        } catch(\Exception $e) {
        }

        return "";
    }
}
