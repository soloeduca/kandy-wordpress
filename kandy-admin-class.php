<?php

class KandyAdmin {
    public function __construct() {
        global $wp_version;
       // add_action("init", array($this, 'enqueue_scripts_and_styles'));
        add_action('admin_menu', array($this, 'admin_menu'));
        register_activation_hook( __FILE__, array($this,'kandy_install' ));
        add_action( 'plugins_loaded', array($this, 'kandy_install'));
    }
    public function kandy_install() {
        global $wpdb;
        $kandyDbVersion = "1.4";

        $table_name = $wpdb->prefix . 'kandy_users';
        $installed_ver = get_option( "kandy_db_version" );

        if ( $installed_ver != $kandyDbVersion ) {
            $sql = "CREATE TABLE IF NOT EXISTS `".$table_name."` (
                  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
                  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
                  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `domain_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `api_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `api_secret` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `main_user_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
                  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
                  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
                  PRIMARY KEY (`id`)
                )";

            require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
            dbDelta( $sql );

            add_option( 'kandy_db_version', $kandyDbVersion );
        }
    }
    public function admin_menu() {
        $admin = add_menu_page(
            "Kandy Configuration",
            "Kandy",
            "administrator",
            "kandy",
            null,
            //array($this, 'admin_pages'),            // $function
            KANDY_PLUGIN_URL . "/img/kandy-wp.png"
        );
        add_submenu_page(
            "kandy",
            "Kandy Settings",
            "Settings",
            "administrator",
            "kandy",
            array($this, "kandy_admin_pages")
        );
        add_submenu_page(
            "kandy",
            "Kandy User Assignment",
            "User Assignment",
            "administrator",
            "kandy-user-assignment",
            array($this, "kandy_admin_pages")
        );

        add_submenu_page(
            "kandy",
            "Kandy Customization",
            "Customization",
            "administrator",
            "kandy-customization",
            array($this, "kandy_admin_pages")
        );

        add_submenu_page(
            "kandy",
            "Kandy Help",
            "Help",
            "administrator",
            "kandy-help",
            array($this, "kandy_admin_pages")
        );
    }

    function kandy_admin_pages() {
        switch ($_GET["page"]) {
            case "kandy" :
                require_once (dirname(__FILE__) . "/admin/SettingsPage.php");
                $kandySettingPage = new KandySettingsPage();
                $kandySettingPage->render();
                break;
            case "kandy-user-assignment" :
                if(isset($_GET['action'])){
                    $action = $_GET['action'];
                    if($action == "edit"){
                        require_once (dirname(__FILE__) . "/admin/AssignmentEditPage.php");
                        $kandyAssignmentPage = new KandyAssignmentEditPage();
                        $kandyAssignmentPage->render();
                    } elseif($action == "sync"){
                        require_once (dirname(__FILE__) . "/admin/AssignmentSyncPage.php");
                        $kandyAssignmentPage = new KandyAssignmentSyncPage();
                        $kandyAssignmentPage->render();
                    } else{
                        require_once (dirname(__FILE__) . "/admin/AssignmentPage.php");
                        $kandyAssignmentPage = new KandyAssignmentPage();
                        $kandyAssignmentPage->render();
                    }
                } else {
                    require_once (dirname(__FILE__) . "/admin/AssignmentPage.php");
                    $kandyAssignmentPage = new KandyAssignmentPage();
                    $kandyAssignmentPage->render();
                }

                break;
            case "kandy-customization" :
                if(isset($_GET['action'])){
                    $action = $_GET['action'];
                    if($action == "edit"){
                        require_once (dirname(__FILE__) . "/admin/CustomizationEditPage.php");
                        $kandyCustomizationEditPage = new KandyCustomizationEditPage();
                        $kandyCustomizationEditPage->render();
                    } else {
                        require_once (dirname(__FILE__) . "/admin/CustomizationPage.php");
                        $kandyCustomizationPage = new KandyCustomizationPage();
                        $kandyCustomizationPage->render();
                    }

                } else {
                    require_once (dirname(__FILE__) . "/admin/CustomizationPage.php");
                    $kandyCustomizationPage = new KandyCustomizationPage();
                    $kandyCustomizationPage->render();
                }

                break;
            case "kandy-help" :
                require_once (dirname(__FILE__) . "/admin/HelpPage.php");
                $kandySettingPage = new KandyHelpPage();
                $kandySettingPage->render();
                break;
        }
    }

}
