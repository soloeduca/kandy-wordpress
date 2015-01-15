<?php
/**
 * Plugin Name: kandy
 * Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
 * Description: Kandy for wordpress.
 * Version: 2.0
 * Author: kodeplusdev
 * Author URI: https://github.com/kodeplusdev
 * License: GPL2
 */
$pluginURL = $isHttps ? str_replace("http://", "https://", WP_PLUGIN_URL) : WP_PLUGIN_URL;
define("KANDY_PLUGIN_PREFIX", "kandy");
define("KANDY_PLUGIN_URL", $pluginURL . "/" . plugin_basename(dirname(__FILE__)));
define('KANDY_PLUGIN_DIR', dirname(__FILE__));
define('KANDY_API_BASE_URL', 'https://api.kandy.io/v1/');
define('KANDY_JS_URL', "https://kandy-portal.s3.amazonaws.com/public/javascript/kandy/1.1.4/kandy.js");
define('KANDY_FCS_URL', "https://kandy-portal.s3.amazonaws.com/public/javascript/fcs/3.0.0/fcs.js");
define('KANDY_JQUERY', "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
define('KANDY_JQUERY_RELOAD', false);
define('KANDY_SSL_VERIFY', false);
define('KANDY_USER_TABLE', 'kandy_users');
define('KANDY_API_KEY', 'dcb5e07c8408491aa315e2d39bf2d104');
define('KANDY_DOMAIN_SECRET_KEY', 'b8ccfe45cf4d4e14ac10ae272a31fd2a');
define('KANDY_DOMAIN_NAME', 'yomenu.com');

define('KANDY_VIDEO_WRAPPER_CLASS_DEFAULT', 'kandyVideoWrapper');
define('KANDY_VIDEO_STYLE_DEFAULT', 'width: 340px; height: 250px;background-color: darkslategray;');
define('KANDY_VIDEO_MY_TITLE_DEFAULT', 'me');
define('KANDY_VIDEO_THEIR_TITLE_DEFAULT', 'their');
require_once dirname(__FILE__) . '/kandy-admin-class.php';
require_once dirname(__FILE__) . '/kandy-shortcode.php';
require_once dirname(__FILE__) . '/api/kandy-api-class.php';
if (is_admin()) {
    $kandy_admin = new KandyAdmin();
}
KandyShortcode::init();
