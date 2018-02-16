'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import { highlightNavigation } from '../../helper/wpRouting'
import VideoTable from './videoTable'
import EditVideo from './editVideo'

class AllVideos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showTable: true,
            editVideoId: 0
        }

    }

    handleClickOnEdit(videoId) {
        this.setState({
            showTable: false,
            editVideoId: videoId
        })
    }

    changeValueOfShowTable() {
        this.setState({showTable: !this.state.showTable})
    }

    render() {
        return (
            this.state.showTable ?
                <div>
                    <div className='ad-inserter-headline-with-button'>
                        <h2 className='ad-inserter-h2'>All Ad Inserted Videos</h2>
                        <Link to={'/wp/wp-admin/admin.php?page=mpat-ad-insertion-new-video'}>
                            <button className='ad-inserter-button-white-blue'
                                    onClick={() => highlightNavigation('mpat-ad-insertion-all-ad-inserted-videos', 'mpat-ad-insertion-new-video')}>
                                <i className="material-icons">add</i>new video
                            </button>
                        </Link>
                    </div>
                    <div className='ad-insertion-content-wrapper'>
                        <VideoTable onClickOnEditVideo={(videoId => this.handleClickOnEdit(videoId))}/>
                    </div>
                </div>
                :
                <div>
                    <div className='ad-inserter-headline-with-button'>
                        <h2 className='ad-inserter-h2'>Edit Video</h2>
                        <button className='ad-inserter-button-white-blue'
                                onClick={() => this.changeValueOfShowTable()}>
                            <i className="material-icons">chevron_left</i>back
                        </button>
                    </div>
                    <div className='ad-insertion-content-wrapper'>
                        <EditVideo videoId={this.state.editVideoId} onClickonBackButton={() => this.changeValueOfShowTable()}/>
                    </div>
                </div>
        )
    }
}

export default AllVideos