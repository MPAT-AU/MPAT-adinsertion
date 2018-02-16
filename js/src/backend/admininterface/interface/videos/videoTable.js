'use strict'

import React from 'react'
import ReactTooltip from 'react-tooltip'
import { getVideos, deleteVideo } from '../../handler/DBHandler'
import LoadingScreen from '../loadingScreen'
import NoData from '../noData'
import {changeFormat} from '../../helper/format'


class VideoTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            videoDataArray: [],
            loadData: true
        }

        this.getVideoDataArray()
    }

    getVideoDataArray() {
        getVideos().then(result => {
            result = result.sort((a, b) => {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
            }).map((video) => {
                video.showTimeline = false
                video.deleteVideo = false
                video.stringDuration = changeFormat(video.duration)

                return video
            })
            this.setState({
                videoDataArray: result,
                loadData: false
            })
        }, err => {
            console.log('Error ', err)
        })
    }

    handleClickOnEdit(index) {
        console.log('goto edit')
    }

    handleClickOnShowHideTimeline(index) {
        const videoDataArray = this.state.videoDataArray
        videoDataArray[index].showTimeline = !videoDataArray[index].showTimeline
        this.setState({videoDataArray: videoDataArray})
    }

    handleDelete(index) {
        this.setDeleteVideo(index)
        deleteVideo(this.state.videoDataArray[index].id)
            .then(result => {
                this.setDeleteVideo(index)
                if (result) {
                    this.removeVideo(index)
                } else {
                    console.log('Error')
                }
            })
    }

    removeVideo(index) {
        const videoDataArray = this.state.videoDataArray
        const newVideoDataArray = videoDataArray.slice(0,index).concat(videoDataArray.slice(index + 1))
        this.setState({videoDataArray: newVideoDataArray})
    }

    setDeleteVideo(index) {
        const videoDataArray = this.state.videoDataArray
        videoDataArray[index].deleteVideo = !videoDataArray[index].deleteVideo
        this.setState({videoDataArray: videoDataArray})
    }


    handleVideoPreviewInNewTab(index) {
        const win = window.open(this.state.videoDataArray[index].output_dash_url, '_blank');
        win.focus();
    }


    render() {

        const timelineContent = this.state.videoDataArray.map((video,videoIndex) => {

            const fullDuration = video.duration
            let globalLeft = 0
            let output = []

            output.push(<div key='dotted-timeline-key' className='ad-inserter-timeline-dotted-border'></div>)

            video.video_parts.map((videoPart,partIndex) => {
                const partName = videoPart.part_name
                const partFullDuration = parseInt(videoPart.part_full_duration)
                const partDuration = parseInt(videoPart.part_duration)
                const partWidth = (partFullDuration / fullDuration) * 100
                const partLeft = (parseInt(globalLeft) / fullDuration) * 100

                const htmlVideoPart = <div data-tip data-for={'video-' + videoIndex + '-part-' + partIndex + 'tooltip'}
                                         key={'video-' + videoIndex + '-part-' + partIndex + 'div'}
                                         className='ad-inserter-timeline-video-block'
                                         style={{width: (partWidth + "%"), left: (partLeft + '%')}}></div>
                const videoPartTooltip = (
                    <ReactTooltip id={'video-' + videoIndex + '-part-' + partIndex + 'tooltip'}
                                  key={'video-' + videoIndex + '-part-' + partIndex + 'tooltip'}
                                  place='top'
                                  type='dark'
                                  effect='float'
                                  className='react-tooltip'>
                        <h2>{partName}</h2>
                        <p><span>START IN VIDEO </span><span>{changeFormat(globalLeft)}</span></p>
                        <p><span>DURATION </span><span>{changeFormat(partDuration)}</span></p>
                        <p><span>DURATION WITH ADS </span><span>{changeFormat(partFullDuration)}</span></p>
                    </ReactTooltip>
                )
                output.push(htmlVideoPart)
                output.push(videoPartTooltip)

                if (videoPart.ad_blocks !== undefined) {
                    videoPart.ad_blocks.map((block, adBlockIndex) => {
                        const blockDuration = parseInt(block.block_duration)
                        const blockStart = parseInt(block.block_start)
                        const blockWidth = (blockDuration  / fullDuration) * 100
                        const blockLeft = ((parseInt(globalLeft) + blockStart) / fullDuration) * 100

                        const adBlockHead = (
                            <div className='ad-inserter-tooltip-ad-block-header'>
                                <h2>AD BLOCK</h2>
                                <p><span>START IN VIDEO </span><span>{changeFormat(globalLeft + blockStart)}</span></p>
                                <p><span>START IN PART </span><span>{changeFormat(blockStart)}</span></p>
                                <p><span>DURATION </span><span>{changeFormat(blockDuration)}</span></p>
                            </div>
                        )

                        const ads =  block.ad_block_parts.map((adBlockPart,partIndex) => {
                            return (
                                <p key={'video-' + videoIndex + '-part-' + partIndex + '-ad-block-' + adBlockPart.ab_id + '-ad-' + adBlockPart.ad_id + '-part-index-' + partIndex}>
                                    <span>{(Number(adBlockPart.order_nr) + 1) + '. ' + adBlockPart.ad.ad_name + ' '}</span>
                                    <span>{changeFormat(adBlockPart.ad.duration)}</span>
                                </p>
                            )
                        })

                        const htmlBlock = <div data-tip data-for={'video-' + videoIndex + '-part-' + partIndex + '-ad-block-' + adBlockIndex + 'tooltip'}
                                             key={'video-' + videoIndex + '-part-' + partIndex + '-ad-block-' + adBlockIndex + 'div'}
                                             className='ad-inserter-timeline-ad-block'
                                             style={{left: (blockLeft + '%'), width: (blockWidth + '%')}}></div>

                        const htmlBlockTooltip = (
                            <ReactTooltip id={'video-' + videoIndex + '-part-' + partIndex + '-ad-block-' + adBlockIndex + 'tooltip'}
                                          key={'video-' + videoIndex + '-part-' + partIndex + '-ad-block-' + adBlockIndex + 'tooltip'}
                                          place='top'
                                          type='dark'
                                          effect='float'
                                          className='react-tooltip'>
                                {adBlockHead}
                                {ads}
                            </ReactTooltip>
                        )

                        output.push(htmlBlock)
                        output.push(htmlBlockTooltip)

                        globalLeft += blockDuration
                    })
                }
                globalLeft = globalLeft + parseInt(partDuration)
            })

            return output
        })

        const tableContent = this.state.videoDataArray.map((video, index) => {
            return [
                <tr key={index + 'ad-table-view'}
                    className={ this.state.videoDataArray[index].showTimeline ? 'active-row' : null}>
                    {
                        this.state.videoDataArray[index].showTimeline ?
                            <td className='ad-inserter-video-table-row-item ad-inserter-video-table-fixed-size-of-material-icon'>
                                <i className='material-icons material-icon-as-button'
                                   data-tip='React-tooltip'
                                   data-delay-show='500'
                                   data-for={'timeline-' + index}
                                   onClick={this.handleClickOnShowHideTimeline.bind(this,index)}>
                                    expand_more
                                </i>
                                <ReactTooltip place='top'
                                              type='dark'
                                              effect='solid'
                                              className='ad-inserter-react-tooltip'
                                              id={'timeline-' + index}
                                              delayShow={500}>
                                    <span>hide video timeline</span>
                                </ReactTooltip>
                            </td>
                                :
                            <td className='ad-inserter-video-table-row-item ad-inserter-video-table-fixed-size-of-material-icon'>
                                <i className='material-icons material-icon-as-button'
                                   data-tip='React-tooltip'
                                   data-delay-show='500'
                                   data-for={'timeline-' + index}
                                   onClick={this.handleClickOnShowHideTimeline.bind(this,index)}>
                                    theaters
                                </i>
                                <ReactTooltip place='top'
                                              type='dark'
                                              effect='solid'
                                              className='ad-inserter-react-tooltip'
                                              id={'timeline-' + index}
                                              delayShow={500}>
                                    <span>show video timeline</span>
                                </ReactTooltip>
                            </td>
                    }
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-text-left'>{video.name}</td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-text-center ad-inserter-video-table-fixed-width-parts'>{video.number_of_video_parts}</td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-text-center ad-inserter-video-table-fixed-width-ad-blocks'>{video.number_of_ad_blocks}</td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-text-center ad-inserter-video-table-fixed-width-ads'>{video.number_of_ads}</td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-text-right ad-inserter-video-table-fixed-width-duration'>{video.stringDuration}</td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-fixed-size-of-material-icon'>
                        <i className='material-icons material-icon-as-button'
                           data-tip='React-tooltip'
                           data-delay-show='500'
                           data-for={'preview-' + index}
                           onClick={this.handleVideoPreviewInNewTab.bind(this,index)}>
                            ondemand_video
                        </i>
                        <ReactTooltip place='top'
                                      type='dark'
                                      effect='solid'
                                      className='ad-inserter-react-tooltip'
                                      id={'preview-' + index}
                                      delayShow={500}>
                            <span>show video preview</span>
                        </ReactTooltip>
                    </td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-fixed-size-of-material-icon'>
                        <i className="material-icons material-icon-as-button"
                           data-tip="React-tooltip"
                           data-delay-show='500'
                           data-for={'edit-' + index}
                           onClick={() => this.props.onClickOnEditVideo(video.id)}>
                            mode_edit
                        </i>
                        <ReactTooltip place='top'
                                      type='dark'
                                      effect='solid'
                                      className='ad-inserter-react-tooltip'
                                      id={'edit-' + index}
                                      delayShow={500}>
                            <span>edit video</span>
                        </ReactTooltip>
                    </td>
                    <td className='ad-inserter-video-table-row-item ad-inserter-video-table-fixed-size-of-material-icon'>
                        <i className="material-icons material-icon-as-button"
                           data-tip="React-tooltip"
                           data-delay-show='500'
                           data-for={'delete-' + index}
                           onClick={this.handleDelete.bind(this,index)}>
                            delete
                        </i>
                        <ReactTooltip place='top'
                                      type='dark'
                                      effect='solid'
                                      className='ad-inserter-react-tooltip'
                                      id={'delete-' + index}
                                      delayShow={500}>
                            <span>delete video</span>
                        </ReactTooltip>
                    </td>
                </tr>,
                <tr>
                    <td colSpan='9' className={ this.state.videoDataArray[index].showTimeline ? 'ad-inserter-table-edit-ad-view active' : 'ad-inserter-table-edit-ad-view' }>
                        {
                            this.state.videoDataArray[index].showTimeline ?
                            <div className='ad-inserter-timeline'>
                                {timelineContent[index]}
                            </div>        
                                :
                            null
                        }
                    </td>
                </tr> 
            ]
        })

        const loadingScreenOrTable = this.state.loadData ?
            <LoadingScreen/>
                :
            (
                this.state.videoDataArray.length === 0 ?
                <NoData datatype='videos'
                        linkToNew='/wp/wp-admin/admin.php?page=mpat-ad-insertion-new-video'
                        from='mpat-ad-insertion-all-ad-inserted-videos'
                        to='mpat-ad-insertion-new-video'
                        buttonText='new Video'/>
                :
                <table className='ad-inserter-table'>
                    <thead className='ad-inserter-thead'>
                        <tr>
                            <th></th>
                            <th className='ad-inserter-video-table-row-item ad-inserter-video-table-text-left'>name</th>
                            <th className='ad-inserter-video-table-row-item ad-inserter-video-table-text-center ad-inserter-video-table-fixed-width-parts'>parts</th>
                            <th className='ad-inserter-video-table-row-item ad-inserter-video-table-text-center ad-inserter-video-table-fixed-width-ad-blocks'>ad blocks</th>
                            <th className='ad-inserter-video-table-row-item ad-inserter-video-table-text-center ad-inserter-video-table-fixed-width-ads'>ads</th>
                            <th className='ad-inserter-video-table-row-item ad-inserter-video-table-text-right ad-inserter-video-table-fixed-width-duration'>duration</th>
                            <th colSpan='3' className='ad-inserter-video-table-row-item'>actions</th>
                        </tr>
                        </thead>
                    <tbody>
                       {tableContent}
                    </tbody>
                </table>
                
            )

        return (<div>{loadingScreenOrTable}</div>)
    }

}

export default VideoTable