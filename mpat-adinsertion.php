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

        $abs_plugin_path = $_SERVER['DOCUMENT_ROOT'] . PATH_CURRENT_SITE . 'app/plugins/mpat-adinsertion/';
        $ad_insertion_frontend_version = date('ymd-Gis', filemtime($abs_plugin_path . 'js/dist/frontend.min.js'));
        wp_enqueue_script('AdInsertionFrontend', plugin_dir_url(__FILE__) . 'js/dist/frontend.min.js', array(), $ad_insertion_frontend_version, true);

    }

    public static function plugin_backend_script() {

        wp_register_script('AdInsertionInterface', plugin_dir_url(__FILE__) . 'js/dist/interface.min.js');
        wp_register_script('AdInsertionBackend', plugin_dir_url(__FILE__) . 'js/dist/backend.min.js');

        $env_array = array(
            'document_root' => WP_HOME,
            'path' => PATH_CURRENT_SITE
        );

        wp_localize_script('AdInsertionInterface', 'env', $env_array);
        wp_localize_script('AdInsertionBackend', 'env', $env_array);

        $abs_plugin_path = $_SERVER['DOCUMENT_ROOT'] . PATH_CURRENT_SITE . 'app/plugins/mpat-adinsertion/';
        $ad_insertion_interface_version = date('ymd-Gis', filemtime( $abs_plugin_path . 'js/dist/interface.min.js'));
        wp_enqueue_script('AdInsertionInterface', plugin_dir_url(__FILE__) . 'js/dist/interface.min.js', array(), $ad_insertion_interface_version, true);
        $ad_insertion_backend_version = date('ymd-Gis', filemtime($abs_plugin_path . 'js/dist/backend.min.js'));
        wp_enqueue_script('AdInsertionBackend', plugin_dir_url(__FILE__) . 'js/dist/backend.min.js', array(), $ad_insertion_backend_version, true);
        $ad_insertion_css_version = date('ymd-Gis', filemtime($abs_plugin_path . 'css/style.css'));
        wp_enqueue_style('AdInsertion', plugin_dir_url(__FILE__) . 'css/style.css', array(), $ad_insertion_css_version);

    }

    static function createVideoTable() {
        global $wpdb;

        $table_name = 'video';
        if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') != $table_name ) {

            $wpdb->query(
                'CREATE TABLE video (
                            id BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(1000),
                            output_dash_url VARCHAR(1000),
                            output_hls_url VARCHAR(1000)
                        )'
            );
        }

    }

    static function createVideoPartTable() {

        global $wpdb;

        $table_name = 'video_part';
        if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') != $table_name ) {

            $wpdb->query(
                'CREATE TABLE video_part (
                        id BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        v_id BIGINT(20) NOT NULL,
                        name VARCHAR(1000),
                        dash_url VARCHAR(1000),
                        hls_url VARCHAR(1000),
                        part_nr INT,
                        duration INT,
                        CONSTRAINT `fk_video_part_video` FOREIGN KEY (v_id) REFERENCES video (id) ON DELETE CASCADE ON UPDATE RESTRICT
                    )'
            );
        }

    }

    static function createAdBlockTable() {

        global $wpdb;

        $table_name = 'ad_block';
        if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') != $table_name ) {

            $wpdb->query(
                'CREATE TABLE ad_block (
                        id BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        vp_id BIGINT(20) NOT NULL,
                        sec_in_part INT(20),
                         CONSTRAINT `fk_ad_block_video_part` FOREIGN KEY (vp_id) REFERENCES video_part (id) ON DELETE CASCADE ON UPDATE RESTRICT
                    )'
            );
        }

    }

    static function createAdBlockPartTable() {

        global $wpdb;

        $table_name = 'ad_block_part';
        if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') != $table_name ) {

            $wpdb->query(
                'CREATE TABLE ad_block_part (
                        ab_id BIGINT(20) NOT NULL,
                        order_nr INT(20) NOT NULL,
                        ad_id BIGINT(20) NOT NULL,
                        PRIMARY KEY(ab_id, order_nr),
                        CONSTRAINT `fk_ad_block_part_ad_block` FOREIGN KEY (ab_id) REFERENCES ad_block (id) ON DELETE CASCADE ON UPDATE RESTRICT,
                        CONSTRAINT `fk_ad_block_part_ad` FOREIGN KEY (ad_id) REFERENCES ad (id) ON DELETE CASCADE ON UPDATE RESTRICT
                    )'
            );
        }

    }

    static function createAdTable() {

        global $wpdb;

        $table_name = 'ad';
        if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') != $table_name ) {

            $wpdb->query(
                'CREATE TABLE ad (
                        id BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(1000),
                        dash_url VARCHAR(1000),
                        hls_url VARCHAR(1000),
                        duration INT
                    )'
            );
        }

    }

    static function display() {

        $path = $_SERVER['DOCUMENT_ROOT'] . PATH_CURRENT_SITE . 'wp/wp-load.php';
        include_once $path;

        AdInsertion::createVideoTable();
        AdInsertion::createAdTable();
        AdInsertion::createVideoPartTable();
        AdInsertion::createAdBlockTable();
        AdInsertion::createAdBlockPartTable();

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

