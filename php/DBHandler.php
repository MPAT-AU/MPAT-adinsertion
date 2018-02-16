<?php
// $mpat_table_prefix = 'mpat';

// just for debugging
function debug_to_console( $data ) {
    $output = $data;
    if ( is_array( $output ) )
        $output = implode( ',', $output);

    echo "<script>console.log( 'DB Handler Log: " . $output . "' );</script>";
}

// includes the $wpdb class
define( 'SHORTINIT', true );
$path = $_SERVER['DOCUMENT_ROOT'];
include_once $path . '/wp/wp-load.php';

// handling POST requests
if ( isset( $_POST['function'] ) ) {
    switch ( $_POST['function'] ) {
        case 'createTables':
            createVideoTable();
            createAdTable();
            createVideoPartTable();
            createAdBlockTable();
            createAdBlockPartTable();
            break;
        case 'deleteTables':
            deleteAdBlockPartTable();
            deleteAdTable();
            deleteAdBlockTable();
            deleteVideoPartTable();
            deleteVideoTable();
            break;
        case 'createData': 
            createData();
            break;
        case 'createVideo':                                 //1.3
            createVideo($_POST['json']);
            break;
        case 'updateVideo':                                 //1.4
            updateVideo($_POST['json']);
            break; 
        case 'deleteVideo':                                 //1.5
            deleteVideo($_POST['id']);
            break;     
        case 'createVideoPart':                                 //2.1
            createVideoPart($_POST['json']);
            break;
        case 'updateVideoPart':                                 //2.2
            updateVideoPart($_POST['id'],$_POST['json']);
            break; 
        case 'deleteVideoPart':                                 //2.3
            deleteVideoPart($_POST['id']);
            break;       
        case 'createAdBlock':                                   //3.1
            createAdBlock($_POST['json']);
            break;
        case 'updateAdBlock':                                   //3.2
            updateAdBlock($_POST['id'],$_POST['json']);
            break; 
        case 'deleteAdBlock':                                   //3.3
            deleteAdBlock($_POST['id']);
            break;    
        case 'createAd':                                        //4.3
            createAd($_POST['json']);
            break;
        case 'updateAd':                                        //4.4
            updateAd($_POST['id'],$_POST['json']);
            break; 
        case 'deleteAd':                                        //4.5
            deleteAd($_POST['id']);
            break;
        case 'createAdBlockPart':                               //5.1
            createAdBlockPart($_POST['json']);
            break;
        case 'updateAdBlockPart':                                //5.2
            updateAdBlockPart($_POST['ab_id'],$_POST['order_nr'],$_POST['ad_id']);
            break; 
        case 'deleteAdBlockPart':                                    //5.3
            deleteAdBlockPart($_POST['ab_id'],$_POST['order_nr']);
            break;                
    }
}

// handling GET requests
if ( isset( $_GET['function'] ) ) {
    switch ( $_GET['function'] ) {
        case 'getVideos':                   //1.1.1
            getVideos();
            break;
        case 'getVideo':                    //1.2
            getVideo($_GET['id']);
            break;
        case 'getVideosForDropdown':        //1.1.2
            getVideosForDropdown();
            break;    
        case 'getAds':                      //4.1.1
            getAds();
            break;
        case 'getAdsWithCount':             //4.1.2
            getAdsWithCount();
            break;    
        case 'getAd':                       //4.2
            getAd($_GET['id']);
            break;
    }
}

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

function deleteVideoTable() {
    global $wpdb;
    
    $table_name = 'video';
    if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') == $table_name ) {
        $wpdb->query( 
            'DROP TABLE video'
        );
    }
}

function deleteVideoPartTable() {
    global $wpdb;
    
    $table_name = 'video_part';
    if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') == $table_name ) {
        $wpdb->query( 
            'DROP TABLE video_part'
        );
    }
}

function deleteAdBlockTable() {
    global $wpdb;
    
    $table_name = 'ad_block';
    if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') == $table_name ) {
        $wpdb->query( 
            'DROP TABLE ad_block'
        );
    }
}

function deleteAdBlockPartTable() {
    global $wpdb;
    $table_name = 'ad_block_part';
    if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') == $table_name ) {
        $wpdb->query( 
            'DROP TABLE ad_block_part'
        );
    }
}

function deleteAdTable() {
    global $wpdb;
    
    $table_name = 'ad';
    if ( $wpdb->get_var('SHOW TABLES LIKE \''.$table_name.'\';') == $table_name ) {
        $wpdb->query( 
            'DROP TABLE ad'
        );
    }
}

//1.1.1
function getVideos() {
    global $wpdb;
    $return_videos = array();

    $videos = $wpdb->get_results( 
        'SELECT id, name, output_dash_url, output_hls_url, IFNULL(number_of_video_parts, 0) AS number_of_video_parts, IFNULL(number_of_ad_blocks, 0) AS number_of_ad_blocks, IFNULL(number_of_ads, 0) AS number_of_ads, IFNULL(dur.duration, 0) AS duration
            FROM video v
			LEFT JOIN (SELECT v_id, COUNT(*) as number_of_video_parts 
					FROM video_part
    	            GROUP BY v_id) novp ON v.id = novp.v_id
			LEFT JOIN (SELECT vp.v_id, COUNT(*) as number_of_ad_blocks
		            FROM video_part vp, ad_block ab
		            WHERE vp.id = ab.vp_id
		            GROUP BY vp.v_id) noab ON v.id = noab.v_id
			LEFT JOIN (SELECT vp.v_id, COUNT(*) AS number_of_ads
					FROM video_part vp, ad_block ab, ad_block_part abp
					WHERE vp.id = ab.vp_id AND ab.id = abp.ab_id
					GROUP BY vp.v_id) noa ON v.id = noa.v_id
			LEFT JOIN (SELECT v.id AS v_id, SUM(vp.duration) + SUM(IFNULL(ad_block_duration,0)) AS duration
	                    FROM video v, video_part vp
                        LEFT JOIN (SELECT ab.vp_id, SUM(ad.duration) as ad_block_duration
				                    FROM ad_block ab, ad_block_part abp, ad
	    		                    WHERE ab.id = abp.ab_id AND abp.ad_id = ad.id
	    		        GROUP BY ab.vp_id) ad_sum ON vp.id = ad_sum.vp_id
	    WHERE v.id = vp.v_id
	    GROUP BY v.id) dur ON v.id = dur.v_id'
    );
 
    foreach( $videos as $video ) {
        $video_id = $video->id;
        
        $video_part_results = $wpdb->get_results( $wpdb->prepare(
            'SELECT vp.id, vp.name as part_name, vp.duration as part_duration, SUM(IFNULL(ab.block_duration, 0)) + duration  as part_full_duration
            FROM video_part vp
          	LEFT JOIN (SELECT ab.vp_id, ab.id, SUM(ad.duration) as block_duration
                					FROM ad_block ab, ad_block_part abp, ad
                					WHERE ab.id = abp.ab_id AND abp.ad_id = ad.id
                					GROUP BY ab.id) ab ON vp.id = ab.vp_id
            WHERE v_id = %d
            GROUP BY vp.id',
            $video_id
        ));
        
        foreach( $video_part_results as $video_part ) {
            $video_part_id = $video_part->id;

            $ad_block_results = $wpdb->get_results( $wpdb->prepare(
                'SELECT ab.id, SUM(ad.duration) as block_duration, ab.sec_in_part as block_start
                FROM ad_block ab, ad_block_part abp, ad
                WHERE ab.id = abp.ab_id AND abp.ad_id = ad.id AND vp_id = %d
                GROUP BY ab.id',
                $video_part_id
            ));

            foreach( $ad_block_results as $ad_block ) {
                $ad_block_id = $ad_block->id;
    
                $ad_block_part_results = $wpdb->get_results( $wpdb->prepare(
                    'SELECT *
                    FROM ad_block_part
                    WHERE ab_id = %d
                    ORDER BY ab_id ASC, order_nr ASC',
                    $ad_block_id
                ));

                foreach( $ad_block_part_results as $ad_block_part ) {
                    $ad_block_part_ad_id = $ad_block_part->ad_id;
        
                    $ad_results = $wpdb->get_results( $wpdb->prepare(
                        'SELECT name as ad_name, duration
                        FROM ad
                        WHERE id = %d',
                        $ad_block_part_ad_id
                    ));         

                    $ad_block_part->ad = $ad_results[0];
                    $ad_block->ad_block_parts[] = $ad_block_part;
                }
                
                $video_part->ad_blocks[] = $ad_block;
            }
            $video->video_parts[] = $video_part;
        }
        $return_videos[] = $video;
    } 

    $json = json_encode( $return_videos );
    echo $json;
}

//1.1.2
function getVideosForDropdown() {
    global $wpdb;

    $results = $wpdb->get_results( 
        'SELECT video.name, video.id, video.output_dash_url, video.output_hls_url
            FROM video'
    );
 
    $json = json_encode( $results );
    echo $json;
}

//1.2
function getVideo($id) {
    global $wpdb;

    $video_results = $wpdb->get_results( $wpdb->prepare(
        'SELECT *
        FROM video
        WHERE id = %d',
        $id
    ));
    
    foreach( $video_results as $video ) {
        $video_id = $video->id;
        
        $video_part_results = $wpdb->get_results( $wpdb->prepare(
            'SELECT *
            FROM video_part
            WHERE v_id = %d',
            $video_id
        ));
        
        foreach( $video_part_results as $video_part ) {
            $video_part_id = $video_part->id;

            $ad_block_results = $wpdb->get_results( $wpdb->prepare(
                'SELECT *
                FROM ad_block
                WHERE vp_id = %d',
                $video_part_id
            ));

            foreach( $ad_block_results as $ad_block ) {
                $ad_block_id = $ad_block->id;
    
                $ad_block_part_results = $wpdb->get_results( $wpdb->prepare(
                    'SELECT *
                    FROM ad_block_part
                    WHERE ab_id = %d',
                    $ad_block_id
                ));

                foreach( $ad_block_part_results as $ad_block_part ) {
                    $ad_block_part_ad_id = $ad_block_part->ad_id;
        
                    $ad_results = $wpdb->get_results( $wpdb->prepare(
                        'SELECT *
                        FROM ad
                        WHERE id = %d',
                        $ad_block_part_ad_id
                    ));         

                    $ad_block_part->ad = $ad_results[0];
                    $ad_block->ad_block_parts[] = $ad_block_part;
                }
                
                $video_part->ad_blocks[] = $ad_block;
            }
            $video->video_parts[] = $video_part;
        }
    } 
    $json = json_encode($video);
    echo $json;
}

// 1.3
function createVideo($json){
    global $wpdb;

    // ad's already exists
    // create video row
    $video_result = $wpdb->insert( 
        'video', 
        array(  
            'name' => $json['name'],
            'output_dash_url' => $json['output_dash_url'],
            'output_hls_url' => $json['output_hls_url']
        )
    );
    $video_id = $wpdb->insert_id;

    // create video_part row
    $parts = $json['parts'];
    foreach( $parts as $part ) {
        $part_result = $wpdb->insert( 
            'video_part', 
            array(  
                'v_id' => $video_id,
                'name' => $part['name'],
                'dash_url' => $part['dash_url'],
                'hls_url' => $part['hls_url'],
                'part_nr' => $part['part_nr'],
                'duration' => $part['duration']
            )
        );

        $video_part_id = $wpdb->insert_id;

        $ad_blocks = $part['ad_blocks'];

        // create ad_block row
        foreach( $ad_blocks as $ad_block ) {
            $ad_block_result = $wpdb->insert( 
                'ad_block',
                array(
                    'vp_id' => $video_part_id,
                    'sec_in_part' => $ad_block['sec_in_part']
                )
            );

            // create ad_block_part row
            $ad_block_id = $wpdb->insert_id;
            
            if (isset( $ad_block['ad_block_parts'] )) {
                $ad_block_parts = $ad_block['ad_block_parts'];
    
                foreach( $ad_block_parts as $ad_block_part ) {
                    $ad_block_part_result = $wpdb->insert(
                        'ad_block_part',
                        array(
                            'ab_id' => $ad_block_id,
                            'order_nr' => $ad_block_part['order_nr'],
                            'ad_id' => $ad_block_part['ad_id']
                        )
                    );
                }
            }
        }
    }
}

// 1.4
function updateVideo($json){
    global $wpdb;

    $video_id = $json['id'];

    deleteVideo($video_id);
    createVideo($json);


    if ($result){
        echo true;
    } else {
        echo false;
    } 
}

// 1.5
function deleteVideo($id){
    global $wpdb;

    $result = $wpdb->delete( 
        'video', 
        array(
             'id' => $id
        ),
        array( 
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}










// 2.1
function createVideoPart($json){
    global $wpdb;

    $result = $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => $json['v_id'], 
            'name' => $json['name'],
            'dash_url' => $json['dash_url'],
            'hls_url' => $json['hls_url'],
            'part_nr' => $json['part_nr']
        ), 
        array( 
            '%d', 
            '%s',
            '%s',
            '%s',
            '%d'
        ) 
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 2.2
function updateVideoPart($id,$json){
    global $wpdb;

    $result = $wpdb->update( 
        'video_part', 
        array( 
            'v_id' => $json['v_id'], 
            'name' => $json['name'],
            'dash_url' => $json['dash_url'],
            'hls_url' => $json['hls_url'],
            'part_nr' => $json['part_nr']
        ),
        array(
            'id' => $id 
        ), 
        array( 
            '%d', 
            '%s',
            '%s',
            '%s',
            '%d'
        ),
        array(
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 2.3
function deleteVideoPart($id){
    global $wpdb;

    $result = $wpdb->delete( 
        'video_part', 
        array(
             'id' => $id
        ),
        array( 
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

function getVideoParts( $video_id ) {
    global $wpdb;

    $results = $wpdb->get_results( $wpdb->prepare(  
        'SELECT id
        FROM video_part
        WHERE v_id = %d',
        $video_id
    ));
 
    $json = json_encode($results);
    return $json;
}












// 3.1
function createAdBlock($json){
    global $wpdb;

    $result = $wpdb->insert( 
        'ad_block', 
        array( 
            'sec_in_part' => $json['sec_in_part'], 
            'vp_id' => $json['vp_id']
        ), 
        array( 
            '%d', 
            '%d'
        ) 
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 3.2
function updateAdBlock($id,$json){
    global $wpdb;

    $result = $wpdb->update( 
        'ad_block', 
        array( 
            'sec_in_part' => $json['sec_in_part'],
            'vp_id' => $json['vp_id']
        ),
        array(
            'id' => $id
        ), 
        array( 
            '%d',
            '%d'
        ),
        array(
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 3.3
function deleteAdBlock($id){
    global $wpdb;

    $result = $wpdb->delete( 
        'ad_block', 
        array(
             'id' => $id
        ),
        array( 
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}










// 4.1
function getAds() {
    global $wpdb;

    $results = $wpdb->get_results( 
        'SELECT *
        FROM ad'
    );
 
    $json = json_encode( $results );
    echo $json;
}

// 4.1.2
function getAdsWithCount() {
    global $wpdb;

    $results = $wpdb->get_results( 
        "   SELECT ad.id, ad.name, ad.dash_url, ad.hls_url, ad.duration, IFNULL(aduse.uses,0) AS uses
            FROM ad LEFT JOIN (SELECT ad_block_part.ad_id AS id, COUNT(*) AS uses 
                            FROM ad_block_part 
                            GROUP BY ad_block_part.ad_id) AS aduse ON  ad.id = aduse.id
        "
    );

    $json = json_encode( $results );
    echo $json;
}

// 4.2
function getAd($id) {
    global $wpdb;

    $result = $wpdb->get_results( $wpdb->prepare(  
        'SELECT *
        FROM ad
        WHERE id = %d',
        $id
    ));
     

    if (is_null($result)){
        echo false;
    } else {
        $json = json_encode($result[0]);
        echo $json;
    }
    return $json;
}

// 4.3
function createAd($json){
    global $wpdb;

    $result = $wpdb->insert( 
        'ad', 
        array( 
            'name' => $json['name'], 
            'dash_url' => $json['dash_url'],
            'hls_url' => $json['hls_url'],
            'duration' => $json['duration']
        ), 
        array( 
            '%s', 
            '%s',
            '%s',
            '%d' 
        ) 
    );

    if (false === $result){
        echo false;
    } else {
        getAd($wpdb->insert_id);
    } 
}

// 4.4
function updateAd($id,$json){
    global $wpdb;

    $result = $wpdb->update( 
        'ad', 
        array( 
            'name' => $json['name'], 
            'dash_url' => $json['dash_url'],
            'hls_url' => $json['hls_url'],
            'duration' => $json['duration']
        ),
        array(
            'id' => $id
        ), 
        array( 
            '%s', 
            '%s',
            '%s',
            '%d' 
        ),
        array(
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 4.5
function deleteAd($id){
    global $wpdb;

    $result = $wpdb->delete( 
        'ad', 
        array(
             'id' => $id 
        ),
        array( 
            '%d' 
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}











// 5.1
function createAdBlockPart($json){
    global $wpdb;

    $result = $wpdb->insert( 
        'ad_block_part', 
        array( 
            'ab_id' => $json['ab_id'], 
            'order_nr' => $json['order_nr'],
            'ad_id' => $json['ad_id']
        ), 
        array( 
            '%d', 
            '%d',
            '%d' 
        ) 
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 5.2
function updateAdBlockPart($ab_id,$order_nr,$ad_id){
    global $wpdb;

    $result = $wpdb->update( 
        'ad_block_partad', 
        array( 
            'ad_id' => $ad_id
        ),
        array(
            'ab_id' => $ab_id, 
            'order_nr' => $order_nr
        ), 
        array( 
            '%d'
        ),
        array(
            '%d',
            '%d'
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}

// 5.3
function deleteAdBlockPart($ab_id,$order_nr){
    global $wpdb;

    $result = $wpdb->delete( 
        'ad_block_part', 
        array(
             'ab_id' => $ab_id,
             'order_nr' => $order_nr
        ),
        array( 
            '%d',
            '%d' 
        )
    );

    if (false === $result){
        echo false;
    } else {
        echo true;
    } 
}















function createData() {
    global $wpdb;
    // creating videos
    $wpdb->insert( 
        'video', 
        array( 
            'name' => 'video 1', 
            'output_dash_url' => 'http://daiservices.fokus.fraunhofer.de:3002/mpds/1515962031964.mpd',
            'output_hls_url' => 'video hls url 1'

        )
    );

    $wpdb->insert( 
        'video', 
        array( 
            'name' => 'video 2', 
            'output_dash_url' => 'http://daiservices.fokus.fraunhofer.de:3002/mpds/1512926780398.mpd',
            'output_hls_url' => 'video hls url 2'

        )
    );

    $wpdb->insert( 
        'video', 
        array( 
            'name' => 'video 3', 
            'output_dash_url' => 'http://daiservices.fokus.fraunhofer.de:3002/mpds/1512920080953.mpd',
            'output_hls_url' => 'video hls url 3'

        )
    );

    $wpdb->insert( 
        'video', 
        array( 
            'name' => 'video 4', 
            'output_dash_url' => 'http://elive.fokus.fraunhofer.de/websrv/waipu/dash/waipu_testcontent_02/waiputestcontent_02.mpd',
            'output_hls_url' => 'video hls url 4'

        )
    );

    // create ads
    $wpdb->insert( 
        'ad', 
        array( 
            'name' => 'ad 1',
            'dash_url' => 'ad dash url 1',
            'hls_url' => 'ad hls url 1',
            'duration' => 16345
        )
    );

    $wpdb->insert( 
        'ad', 
        array( 
            'name' => 'ad 2',
            'dash_url' => 'ad dash url 2',
            'hls_url' => 'ad hls url 2',
            'duration' => 20324
        )
    );
    
    $wpdb->insert( 
        'ad', 
        array( 
            'name' => 'ad 3',
            'dash_url' => 'ad dash url 3',
            'hls_url' => 'ad hls url 3',
            'duration' => 12839
        )
    );

    // create video parts
    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 1,
            'name' => 'video_part 1',
            'dash_url' => 'video_part dash url 1',
            'hls_url' => 'video_part hls url 1',
            'part_nr' => 1,
            'duration' => 120342
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 1,
            'name' => 'video_part 2',
            'dash_url' => 'video_part dash url 2',
            'hls_url' => 'video_part hls url 2',
            'part_nr' => 2,
            'duration' => 80338
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 1,
            'name' => 'video_part 3',
            'dash_url' => 'video_part dash url 3',
            'hls_url' => 'video_part hls url 3',
            'part_nr' => 3,
            'duration' => 43895
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 2,
            'name' => 'video_part 4',
            'dash_url' => 'video_part dash url 4',
            'hls_url' => 'video_part hls url 4',
            'part_nr' => 1,
            'duration' => 344893
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 3,
            'name' => 'video_part 5',
            'dash_url' => 'video_part dash url 5',
            'hls_url' => 'video_part hls url 5',
            'part_nr' => 1,
            'duration' => 49844
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 3,
            'name' => 'video_part 6',
            'dash_url' => 'video_part dash url 6',
            'hls_url' => 'video_part hls url 6',
            'part_nr' => 2,
            'duration' => 89493
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 3,
            'name' => 'video_part 7',
            'dash_url' => 'video_part dash url 7',
            'hls_url' => 'video_part hls url 7',
            'part_nr' => 3,
            'duration' => 100000
        )
    );

    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 3,
            'name' => 'video_part 8',
            'dash_url' => 'video_part dash url 8',
            'hls_url' => 'video_part hls url 8',
            'part_nr' => 4,
            'duration' => 3399949
        )
    );
       
    $wpdb->insert( 
        'video_part', 
        array( 
            'v_id' => 4,
            'name' => 'video_part 9',
            'dash_url' => 'video_part dash url 9',
            'hls_url' => 'video_part hls url 9',
            'part_nr' => 1,
            'duration' => 37828
        )
    );
    
    // create ad blocks
    $wpdb->insert( 
        'ad_block', 
        array(
            'vp_id' => 1,
            'sec_in_part' => 8983
        )
    );

    $wpdb->insert( 
        'ad_block', 
        array(
            'vp_id' => 4,
            'sec_in_part' => 2390
        )
    );

    $wpdb->insert( 
        'ad_block', 
        array(
            'vp_id' => 7,
            'sec_in_part' => 12990
        )
    );

    $wpdb->insert( 
        'ad_block', 
        array(
            'vp_id' => 8,
            'sec_in_part' => 2990
        )
    );

    $wpdb->insert( 
        'ad_block', 
        array(
            'vp_id' => 9,
            'sec_in_part' => 4500
        )
    );

    // create ad block parts
    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 1,
            'order_nr' => 1,
            'ad_id' => 1
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 1,
            'order_nr' => 2,
            'ad_id' => 2
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 1,
            'order_nr' => 3,
            'ad_id' => 3
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 2,
            'order_nr' => 1,
            'ad_id' => 1
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 2,
            'order_nr' => 2,
            'ad_id' => 2
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 3,
            'order_nr' => 1,
            'ad_id' => 1
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 3,
            'order_nr' => 2,
            'ad_id' => 2
        )
    );

    $wpdb->insert( 
        'ad_block_part', 
        array(
            'ab_id' => 4,
            'order_nr' => 1,
            'ad_id' => 1
        )
    );

}

?>