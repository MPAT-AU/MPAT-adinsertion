<?php

/**
 * @link            URL to plugin homepage
 * @since           1.0.0
 *
 * Plugin Name:     MPAT Video Ad Insertion Plugin
 * Plugin URI:      https://github.com/Mark-003/MPAT-adinsertion
 * Description:     Plugin to insert ads into DASH/HLS streams.
 * Version:         1.0.0
 * Author:          Mark-003
 * Author URI:      https://github.com/Mark-003
 * License:
 * License URI:
 * Text Domain:
 */
class AdInsertion {

    public static function plugin_frontend_script() {
        wp_enqueue_script('mpat_core', plugin_dir_url(__FILE__) . '/../../mpat-plugins/js/mpat_core.min.js', array(), 1, true);
        wp_enqueue_script('AdInsertionFrontend', plugin_dir_url(__FILE__) . 'js/dist/frontend.min.js', array(), 1, true);
    }

    public static function plugin_backend_script() {
        wp_enqueue_script('mpat_admin', plugin_dir_url(__FILE__) . '/../../mpat-plugins/js/mpat_admin.min.js', array(), 1, true);
        wp_enqueue_script('AdInsertionBackend', plugin_dir_url(__FILE__) . 'js/dist/backend.min.js', array(), 1, true);
        wp_enqueue_style('AdInsertion', plugin_dir_url(__FILE__) . 'css/style.css');
    }

    static function display() {
        ?>
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js" type="text/javascript"></script>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <div id="reactRoot" class="wrap ad-inserter"></div>
        <?php
    }

    public static function addToAdminPage() {
        add_menu_page(
            'MPAT Ad Insertion Plugin',
            'Video Ad Insertion',
            'edit_pages',
            'mpat-ad-insertion',
            array(AdInsertion::class, 'display'),
            'dashicons-format-video'
        );
        add_submenu_page(
            'mpat-ad-insertion',
            'All Ad Inserted Videos',
            'All Ad Inserted Videos',
            'edit_pages',
            'mpat-ad-insertion-all-ad-inserted-videos',
            array(AdInsertion::class, 'display')
        );
        add_submenu_page(
            'mpat-ad-insertion',
            'New Video',
            'New Video',
            'edit_pages',
            'mpat-ad-insertion-new-video',
            array(AdInsertion::class, 'display')
        );
        add_submenu_page(
            'mpat-ad-insertion',
            'All Ads',
            'All Ads',
            'edit_pages',
            'mpat-ad-insertion-all-ads',
            array(AdInsertion::class, 'display')
        );
        add_submenu_page(
            'mpat-ad-insertion',
            'New Ad',
            'New Ad',
            'edit_pages',
            'mpat-ad-insertion-new-ad',
            array(AdInsertion::class, 'display')
        );
    }

}

add_action('wp_enqueue_scripts', array(AdInsertion::class, "plugin_frontend_script"), 100);
add_action('admin_enqueue_scripts', array(AdInsertion::class, "plugin_backend_script"), 100);
add_action('admin_menu', array(AdInsertion::class, 'addToAdminPage'), 100);

