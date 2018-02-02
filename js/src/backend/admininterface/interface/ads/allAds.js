'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import { highlightNavigation } from '../../helper/wpRouting'
import AdTable from './adTable'

class AllVideos extends React.Component {
    render() {
        return (
            <div>
                <div className='ad-inserter-headline-with-button'>
                    <h2 className='ad-inserter-h2'>All Ads</h2>
                    <Link to={'/wp/wp-admin/admin.php?page=mpat-ad-insertion-new-ad'}>
                        <button className='ad-inserter-button-white-blue'
                                onClick={() => highlightNavigation('mpat-ad-insertion-all-ads','mpat-ad-insertion-new-ad')}>
                            <i className="material-icons">add</i>new ad
                        </button>
                    </Link>
                </div>
                <div className='ad-insertion-content-wrapper'>
                    <AdTable/>
                </div>
            </div>
        );
    }
}

export default AllVideos