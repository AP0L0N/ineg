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

use GuzzleHttp\Client;

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
class ReviewsController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ['get-google-reviews'];

    public function actionGetGoogleReviews() {
        $cache = Craft::$app->getCache();
        $reviews = $cache->get('reviews');

        if(!$reviews) {
            $placesId = getenv("GOOGLE_PLACES_ID");
            $apiKey = getenv("GOOGLE_PLACES_API_KEY");
            $url = "https://maps.googleapis.com/maps/api/place/details/json?place_id={$placesId}&key={$apiKey}";
    
            $client = new Client();
    
            try {
                $response = $client->request('GET', $url, [
                    'verify' => false 
                ]);
    
                $data = json_decode($response->getBody()->getContents(), true);
                
                $reviews = [
                    'status' => 'success',
                    'data' => $data
                ];

                $cache->set('reviews', $reviews, 3600 * 24);

            } catch (\GuzzleHttp\Exception\RequestException $e) {
                $reviews = [
                    'status' => 'error',
                    'message' => 'Failed to fetch Google reviews.'
                ];
            }
        }
        
        return $this->asJson($reviews);
    }
}
