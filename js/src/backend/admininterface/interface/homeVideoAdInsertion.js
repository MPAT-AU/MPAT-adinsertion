'use strict'

import React from 'react'
import { Link } from 'react-router-dom'

import { highlightNavigation } from '../helper/wpRouting'

import { createTables, getVideos, getVideo, getAds, getAd, createAd, updateAd, deleteAd, createData, getAdsWithCount, createVideo, deleteTables, updateVideo } from '../handler/DBHandler';

var createVideoTestJson = {
    "id": 1,
    "name": "Testvideo update",
    "output_dash_url": "http://daiservices.fokus.fraunhofer.de:3002/mpds/1515962031964.mpd",
    "output_hls_url": "http://samp.le/url.hls",
    "parts":  [
      {
        "name": "Part 1",
        "dash_url": "http://daiservices.fokus.fraunhofer.de:3002/mpds/1515962031964.mpd",
        "hls_url": "http://samp.le/url.hls",
        "part_nr": 1,
        "ad_blocks":  [
          {   
            "sec_in_part": 10,
            "ad_block_parts": [
                {
                  "order_nr": 1,
                  "ad_id": 2
                }
                ]
          },
          {   
            "sec_in_part": 10,
            "ad_block_parts": [
                {
                  "order_nr": 2,
                  "ad_id": 2
                }
                ]
          }
        ]
      },
      {
        "name": "Part 2",
        "dash_url": "http://daiservices.fokus.fraunhofer.de:3002/mpds/1515962031964.mpd",
        "hls_url": "http://samp.le/url.hls",
        "part_nr": 2,
        "ad_blocks":  [
          {   
            "sec_in_part": 10,
            "ad_block_parts": [
              {
                "order_nr": 1,
                "ad_id": 2
              }
              ]
          },
          {   
            "sec_in_part": 10,
            "ad_block_parts": [
                {
                  "order_nr": 2,
                  "ad_id": 2
                }
                ]
          }
        ]
      }
    ]
  }

class HomeVideoAdInsertion extends React.Component {
    render() {
        return (
            <div>
                <div className='ad-inserter-headline'>
                    <h2 className='ad-inserter-h2'>MPAT - Video Ad Insertion Plugin</h2>
                </div>
                <div className='ad-insertion-content-wrapper'>
                    <p className='ad-inserter-paragraph'>Welcome to the Ad Insertion Plugin. This Plugin enables you to create ad inserted videos very easily. Your next Video is just a few Clicks away.</p>

                    <hr/>

                    <div className='ad-inserter-section-container'>
                        
                        <div className='ad-inserter-section-second-level-container'>
                            <h2>All Videos</h2>
                            <div className='ad-inserter-section-third-level-container'>
                                <p className='ad-inserter-section-paragraph'>
                                    See all your new created videos here. Just press the button to see a full list of already created videos.
                                </p>
                                <div className='ad-inserter-start-page-image-container'>
                                    <img src={env.document_root + '/app/plugins/mpat-adinsertion/assets/gifs/allAdInsertedVideos-480.gif'} />
                                </div>
                                <div className='ad-inserter-start-page-button-container'>
                                    <Link to={env.path + 'wp/wp-admin/admin.php?page=mpat-ad-insertion-all-ad-inserted-videos'}>
                                        <button className='ad-inserter-button-white-blue'
                                                onClick={() => highlightNavigation('mpat-ad-insertion','mpat-ad-insertion-all-ad-inserted-videos')}>
                                            <i className="material-icons">reorder</i>all ad inserted videos
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className='ad-inserter-section-second-level-container'>
                            <h2>New Video</h2>
                            <div className='ad-inserter-section-third-level-container'>
                                <p className='ad-inserter-section-paragraph'>
                                    Create your new video here. Simply press the button and put together your videos and ads easily.
                                </p>
                                <div className='ad-inserter-start-page-image-container'>
                                    <img src={env.document_root + '/app/plugins/mpat-adinsertion/assets/gifs/newVideo-480.gif'} />
                                </div>
                                <div className='ad-inserter-start-page-button-container'>
                                    <Link to={env.path + 'wp/wp-admin/admin.php?page=mpat-ad-insertion-new-video'}>
                                        <button className='ad-inserter-button-white-blue'
                                                onClick={() => highlightNavigation('mpat-ad-insertion','mpat-ad-insertion-new-video')}>
                                            <i className="material-icons">add</i>new video
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                    <hr/>

                    <div className='ad-inserter-section-container'>
                        
                        <div className='ad-inserter-section-second-level-container'>
                            <h2>All Ads</h2>
                            <div className='ad-inserter-section-third-level-container'>
                                <p className='ad-inserter-section-paragraph'>
                                    See all your ads here. Just press the button to see a full list of already added ads.
                                </p>
                                <div className='ad-inserter-start-page-image-container'>
                                    <img src={env.document_root + '/app/plugins/mpat-adinsertion/assets/gifs/allAds-480.gif'} />
                                </div>
                                <div className='ad-inserter-start-page-button-container'>
                                    <Link to={env.path + 'wp/wp-admin/admin.php?page=mpat-ad-insertion-all-ads'}>
                                        <button className='ad-inserter-button-white-blue'
                                                onClick={() => highlightNavigation('mpat-ad-insertion','mpat-ad-insertion-all-ads')}>
                                            <i className="material-icons">reorder</i>all ads
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className='ad-inserter-section-second-level-container'>
                            <h2>New Ad</h2>
                            <div className='ad-inserter-section-third-level-container'>
                                <p className='ad-inserter-section-paragraph'>
                                    Add all of your ads here. Simply press the button and to create a new add easily.
                                </p>
                                <div className='ad-inserter-start-page-image-container'>
                                    <img src={env.document_root + '/app/plugins/mpat-adinsertion/assets/gifs/newAd-480.gif'} />
                                </div>

                                <div className='ad-inserter-start-page-button-container'>
                                    <Link to={env.path + 'wp/wp-admin/admin.php?page=mpat-ad-insertion-new-ad'}>
                                        <button className='ad-inserter-button-white-blue'
                                                onClick={() => highlightNavigation('mpat-ad-insertion','mpat-ad-insertion-new-ad')}>
                                            <i className="material-icons">add</i>new ad
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr/>
                </div>
            </div>
        );
    }
}

export default HomeVideoAdInsertion