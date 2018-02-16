<?php
// includes the $wpdb class
// define( 'SHORTINIT', true );
$path = $_SERVER['DOCUMENT_ROOT'];
include_once $path . '/wp/wp-load.php';

// database functions
function createVideoTable() {
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

function createVideoPartTable() {
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

function createAdBlockTable() {
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

function createAdBlockPartTable() {
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

function createAdTable() {
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

createVideoTable();
createAdTable();
createVideoPartTable();
createAdBlockTable();
createAdBlockPartTable();

?>