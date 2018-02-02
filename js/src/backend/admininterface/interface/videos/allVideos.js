'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import { highlightNavigation } from '../../helper/wpRouting'
import VideoTable from './videoTable'

class AllVideos extends React.Component {
    render() {
        return (
            <div>
                <div className='ad-inserter-headline-with-button'>
                    <h2 className='ad-inserter-h2'>All Ad Inserted Videos</h2>
                    <Link to={'/wp/wp-admin/admin.php?page=mpat-ad-insertion-new-video'}>
                        <button className='ad-inserter-button-white-blue'
                                onClick={() => highlightNavigation('mpat-ad-insertion-all-ad-inserted-videos','mpat-ad-insertion-new-video')}>
                            <i className="material-icons">add</i>new video
                        </button>
                    </Link>
                </div>
                <div className='ad-insertion-content-wrapper'>
                    <VideoTable/>
                </div>
            </div>
        );
    }
}

export default AllVideos