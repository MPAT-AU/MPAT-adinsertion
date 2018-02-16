'use strict'

import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import LoadingButton from '../loadingButton'
import {highlightNavigation} from '../../helper/wpRouting'
import VideoPart from './videoPart'
import {changeFormat} from '../../helper/format'
import {getDuration, sendAndHandleRequest} from '../../handler/DaiHandler'
import {createAd, createVideo, getAds} from '../../handler/DBHandler'


class CreateVideo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            video: {
                name: '',
                output_dash_url: '',
                output_hls_url: '',
                parts: [
                    {
                        name: '',
                        dash_url: '',
                        hls_url: '',
                        part_nr: 0,
                        duration: 0,
                        durationWithAds: 0,
                        ad_blocks: [],
                        addAdBlock: false
                    }
                ]
            },
            allAdsArray: [],
            createVideo: false,
            redirect: false
        }
        this.getAdArray()
    }

    getAdArray() {
        getAds().then(result => {
            if(result.length === 0) return
            const sortedAds = result.sort((a, b) => {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
            })
            this.setState({allAdsArray: sortedAds})
            this.updateChosenAds()
        }, err => {
            console.log('Error ', err)
        })
    }

    updateChosenAds() {
        let video = this.state.video
        video.parts.map((part,partIndex) => {
            part.ad_blocks.map((adBlock,adBlockIndex) => {
                video.parts[partIndex].ad_blocks[adBlockIndex].chosenAd = this.state.allAdsArray[0]
            })
        })
        this.setState({video: video})
    }

    calculateVideoDuration() {
        return this.state.video.parts.map(part => {
            return part.durationWithAds
        }).reduce((prev,curr) => {
            return prev + curr
        })
    }

    handleChangeName(event) {
        let video = this.state.video
        video.name = event.target.value
        this.setState({video: video})
    }

    handleSubmit(event) {
        event.preventDefault()
        this.setState({createVideo: true})
        sendAndHandleRequest(this.createDaiJson()).then(result => {
            createVideo(this.createVideoJson(result)).then(result => {
                this.setState({
                    createVideo: false,
                    redirect: true
                })
                highlightNavigation('mpat-ad-insertion-new-video', 'mpat-ad-insertion-all-ad-inserted-videos')
            }, error => {
                console.log('Error ',error)
                this.setState({createVideo: false})
            })
        }, error => {
            console.log('Error ',error)
            this.setState({createVideo: false})
        })
        return false
    }

    createDaiJson() {
        let json = {
            content: {}
        }
        const dashContent = this.state.video.parts.map(part => {
            return {
                mpd: part.dash_url,
                baseUrl: this.getBaseUrl(part.dash_url),
                type: 'content',
                subContent: part.ad_blocks.map(adBlock => {
                    const spliceTime = adBlock.sec_in_part
                    return adBlock.ads.map(ad => {
                        return {
                            mpd: ad.dash_url,
                            baseUrl: this.getBaseUrl(ad.dash_url),
                            type: 'ad',
                            spliceTime: spliceTime
                        }
                    })
                }).reduce((prev,curr) => {
                    return prev.concat(curr)
                }, [])
            }
        })
        json.content.dash = dashContent
        return json
    }

    createVideoJson(dashUrl) {
        return {
            name: this.state.video.name,
            output_dash_url: dashUrl,
            output_hls_url: '',
            parts: this.state.video.parts.map(part => {
                return {
                    name: part.name,
                    dash_url: part.dash_url,
                    hls_url: part.hls_url,
                    part_nr: part.part_nr,
                    duration: part.duration,
                    ad_blocks: part.ad_blocks.map(adBlock => {
                        return {
                            sec_in_part: adBlock.sec_in_part,
                            ad_block_parts: adBlock.ads.map((ad,index) => {
                                return {
                                    order_nr: index,
                                    ad_id: ad.id
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    getBaseUrl(url) {
        return url.slice(0, (url.lastIndexOf('/') + 1))
    }

    handleChangeInVideoPart(index, inputName, value, valid) {
        let video = this.state.video
        switch (inputName) {
            case 'videoPartName' : {
                video.parts[index].name = value
                break
            }
            case 'videoPartDash' : {
                if (valid) {
                    getDuration(value).then( result => {
                        let video = this.state.video
                        video.parts[index].duration = Number(result)
                        video.parts[index].durationWithAds += Number(result)
                        this.setState({video: video})
                    }, error => {
                        if (video.parts[index].duration !== 0) {
                            video.parts[index].durationWithAds -= video.parts[index].duration
                            video.parts[index].duration = 0
                            this.setState({video: video})
                        }
                    })
                } else {
                    if (video.parts[index].duration !== 0) {
                        video.parts[index].durationWithAds -= video.parts[index].duration
                        video.parts[index].duration = 0
                    }
                }
                video.parts[index].dash_url = value
                break
            }
            case 'videoPartHls' : {
                video.parts[index].hls_url = value
                break
            }
            default : break
        }
        this.setState({video: video})
    }

    handleClickOnNewPart() {
        let newPart = {
            name: '',
            dash_url: '',
            hls_url: '',
            part_nr: this.state.video.parts.length,
            duration: 0,
            durationWithAds: 0,
            ad_blocks: [],
            addAdBlock: false
        }
        let video = this.state.video
        video.parts.push(newPart)
        this.setState({video: video})
    }

    handleDeletePart(index) {
        if (this.state.video.parts.length !== 1){
            let video = this.state.video
            video.parts = video.parts.slice(0,index).concat(video.parts.slice(index + 1))
            for (index; index < video.parts.length; index++) {
                video.parts[index].part_nr = index
            }
            this.setState({video: video})
        }
    }

    handleClickOnPartUp(index) {
        if (index > 0) {
            let video = this.state.video
            const tmp = this.state.video.parts[index]
            tmp.part_nr = index-1
            this.state.video.parts[index] = this.state.video.parts[index-1]
            this.state.video.parts[index].part_nr = index
            this.state.video.parts[index-1] = tmp
            this.setState({video: video})
        }
    }

    handleClickOnPartDown(index) {
        if (index < this.state.video.parts.length-1) {
            let video = this.state.video
            const tmp = this.state.video.parts[index]
            tmp.part_nr = index+1
            this.state.video.parts[index] = this.state.video.parts[index+1]
            this.state.video.parts[index].part_nr = index
            this.state.video.parts[index+1] = tmp
            this.setState({video: video})
        }
    }

    handleClickOnPartAddAdBlock(index) {
        let video = this.state.video
        video.parts[index].addAdBlock = !video.parts[index].addAdBlock
        this.setState({video: video})
    }

    handleClickOnPartCreateAdBlock(partIndex,secInPart) {
        let video = this.state.video
        const newAdBlock = {
            sec_in_part: secInPart,
            duration: 0,
            ads: [],
            addAd: false,
            addAdName: '',
            addAdDash: '',
            addAdHls: '',
            createAd: false,
            chooseAd: true,
            chosenAd: this.state.allAdsArray[0]
        }
        video.parts[partIndex].ad_blocks.push(newAdBlock)
        if (video.parts[partIndex].ad_blocks.length !== 0) {
            video.parts[partIndex].ad_blocks.sort((blockA, blockB) => {
                return blockA.sec_in_part - blockB.sec_in_part
            })
        }
        video.parts[partIndex].addAdBlock = !this.state.video.parts[partIndex].addAdBlock
        this.setState({video: video})
    }

    handleClickOnDeleteAdBlock(partIndex,adBlockIndex) {
        let video = this.state.video
        video.parts[partIndex].durationWithAds -= video.parts[partIndex].ad_blocks[adBlockIndex].duration
        video.parts[partIndex].ad_blocks = video.parts[partIndex].ad_blocks.slice(0,adBlockIndex).concat(video.parts[partIndex].ad_blocks.slice(adBlockIndex + 1))
        this.setState({video: video})
    }

    handleClickOnAddAdOrCancelAdBlock(partIndex,adBlockIndex) {
        let video = this.state.video
        video.parts[partIndex].ad_blocks[adBlockIndex].addAd = !video.parts[partIndex].ad_blocks[adBlockIndex].addAd
        this.setState({video: video})
    }

    handleOnChangeSelectAdBlock(partIndex,adBlockIndex,allAdsArrayIndex) {
        let video = this.state.video
        video.parts[partIndex].ad_blocks[adBlockIndex].chosenAd = this.state.allAdsArray[allAdsArrayIndex]
        this.setState({video: video})
    }

    handleClickOnRadioButtonOrLabel(partIndex,adBlockIndex,targetId) {
        let video = this.state.video
        const chooseAd = video.parts[partIndex].ad_blocks[adBlockIndex].chooseAd
        if ( (!chooseAd && targetId === 'chooseAd') || (!chooseAd && targetId === 'labelChooseAd') || (chooseAd && targetId === 'createAd') || (chooseAd && targetId === 'labelCreateAd') ) {
            video.parts[partIndex].ad_blocks[adBlockIndex].chooseAd = !chooseAd
            this.setState({video: video})
        }
    }

    handleChangeAddAdAdBlock(partIndex,adBlockIndex,targetId,targetValue) {
        let video = this.state.video
        switch (targetId) {
            case 'name' : {
                video.parts[partIndex].ad_blocks[adBlockIndex].addAdName = targetValue
                break
            }
            case 'dash' : {
                video.parts[partIndex].ad_blocks[adBlockIndex].addAdDash = targetValue
                break
            }
            case 'hls' : {
                video.parts[partIndex].ad_blocks[adBlockIndex].addAdHls = targetValue
                break
            }
            default : break
        }
        this.setState({video: video})
    }

    handleClickOnAddAdToAdBlock(partIndex,adBlockIndex,targetElement) {
        let video = this.state.video
        if (video.parts[partIndex].ad_blocks[adBlockIndex].chooseAd && this.state.allAdsArray.length !== 0) {
            video.parts[partIndex].ad_blocks[adBlockIndex].ads.push(video.parts[partIndex].ad_blocks[adBlockIndex].chosenAd)
            video.parts[partIndex].ad_blocks[adBlockIndex].addAd = false
            const adDuration = video.parts[partIndex].ad_blocks[adBlockIndex].chosenAd.duration
            video.parts[partIndex].ad_blocks[adBlockIndex].duration += Number(adDuration)
            video.parts[partIndex].durationWithAds += Number(adDuration)
            video.parts[partIndex].ad_blocks[adBlockIndex].chosenAd = this.state.allAdsArray[0]
            this.setState({video: video})
        } else {
            if (this.checkAddAdValidation(targetElement)) {
                video.parts[partIndex].ad_blocks[adBlockIndex].createAd = true
                this.setState({video: video})
                getDuration(video.parts[partIndex].ad_blocks[adBlockIndex].addAdDash).then( result => {
                    let video = this.state.video
                    return {
                        name: video.parts[partIndex].ad_blocks[adBlockIndex].addAdName,
                        duration: Number(result),
                        dash_url: video.parts[partIndex].ad_blocks[adBlockIndex].addAdDash,
                        hls_url: video.parts[partIndex].ad_blocks[adBlockIndex].addAdHls
                    }
                }, error => {
                    let video = this.state.video
                    return {
                        name: video.parts[partIndex].ad_blocks[adBlockIndex].addAdName,
                        duration: 0,
                        dash_url: video.parts[partIndex].ad_blocks[adBlockIndex].addAdDash,
                        hls_url: video.parts[partIndex].ad_blocks[adBlockIndex].addAdHls
                    }
                }).then( json =>
                    createAd(json)
                        .then(ad => {
                            let video = this.state.video
                            video.parts[partIndex].ad_blocks[adBlockIndex].ads.push(ad)
                            video.parts[partIndex].ad_blocks[adBlockIndex].createAd = false
                            video.parts[partIndex].ad_blocks[adBlockIndex].addAd = false
                            video.parts[partIndex].ad_blocks[adBlockIndex].addAdName = ''
                            video.parts[partIndex].ad_blocks[adBlockIndex].addAdDash = ''
                            video.parts[partIndex].ad_blocks[adBlockIndex].addAdHls = ''
                            video.parts[partIndex].ad_blocks[adBlockIndex].chooseAd = true
                            video.parts[partIndex].ad_blocks[adBlockIndex].duration += Number(ad.duration)
                            video.parts[partIndex].durationWithAds += Number(ad.duration)
                            this.setState({video: video})

                            this.getAdArray()
                        })
                )
            }
        }
    }

    checkAddAdValidation(e) {
        const parentDiv = e.parentElement.parentElement
        const name = parentDiv.querySelector('#name')
        const dash = parentDiv.querySelector('#dash')
        if (!name.checkValidity()) {
            name.reportValidity()
            return false
        } else if (!dash.checkValidity()) {
            dash.reportValidity()
            return false
        }
        return true
    }

    handleRemoveAdd(partIndex,adBlockIndex,targetIndex) {
        let video = this.state.video
        const adDuration = video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex].duration
        video.parts[partIndex].ad_blocks[adBlockIndex].duration -= Number(adDuration)
        video.parts[partIndex].durationWithAds -= Number(adDuration)
        video.parts[partIndex].ad_blocks[adBlockIndex].ads = video.parts[partIndex].ad_blocks[adBlockIndex].ads.slice(0,targetIndex).concat(video.parts[partIndex].ad_blocks[adBlockIndex].ads.slice(targetIndex + 1))
        this.setState({video: video})
    }

    handleClickOnUpButtonInAdBlock(partIndex,adBlockIndex,targetIndex) {
        if (targetIndex > 0) {
            let video = this.state.video
            const tmp = video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex-1]
            video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex-1] = video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex]
            video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex] = tmp
            this.setState({video: video})
        }
    }

    handleClickOnDownButtonInAdBlock(partIndex,adBlockIndex,targetIndex) {
        let video = this.state.video
        if (targetIndex < video.parts[partIndex].ad_blocks[adBlockIndex].ads.length - 1) {
            const tmp = video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex+1]
            video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex+1] = video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex]
            video.parts[partIndex].ad_blocks[adBlockIndex].ads[targetIndex] = tmp
            this.setState({video: video})
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to='/wp/wp-admin/admin.php?page=mpat-ad-insertion-all-ad-inserted-videos'/>
        }

        let startTime = 0
        const videoParts = this.state.video.parts.map( (part, index) => {
            const currentStartTime = startTime
            startTime += part.durationWithAds
            return <VideoPart key={'video-part-' + index}
                              part={part}
                              start={currentStartTime}
                              allAdsArray={this.state.allAdsArray}
                              onChange={this.handleChangeInVideoPart.bind(this)}
                              isOnlyPart={this.state.video.parts.length === 1}
                              onDelete={this.handleDeletePart.bind(this)}
                              onClickUp={this.handleClickOnPartUp.bind(this)}
                              onClickDown={this.handleClickOnPartDown.bind(this)}
                              onClickAddAdBlock={this.handleClickOnPartAddAdBlock.bind(this)}
                              onClickCreateAdBlock={this.handleClickOnPartCreateAdBlock.bind(this)}
                              onClickDeleteAdBlock={(partIndex,adBlockIndex) => this.handleClickOnDeleteAdBlock(partIndex,adBlockIndex)}
                              onClickAddAdOrCancelAdBlock={(partIndex,adBlockIndex) => this.handleClickOnAddAdOrCancelAdBlock(partIndex,adBlockIndex)}
                              onChangeSelectAdBlock={(partIndex,adBlockIndex,allAdsArrayIndex) => this.handleOnChangeSelectAdBlock(partIndex,adBlockIndex,allAdsArrayIndex)}
                              onClickRadioButtonOrLabelAdBlock={(partIndex,adBlockIndex,targetId) => this.handleClickOnRadioButtonOrLabel(partIndex,adBlockIndex,targetId)}
                              onChangeAddAdAdBlock={(partIndex,adBlockIndex,targetId,targetValue) => this.handleChangeAddAdAdBlock(partIndex,adBlockIndex,targetId,targetValue)}
                              onClickAddAdToAdBlock={(partIndex,adBlockIndex,targetElement) => this.handleClickOnAddAdToAdBlock(partIndex,adBlockIndex,targetElement)}
                              onClickRemoveAdAdBlock={(partIndex,adBlockIndex,targetIndex) => this.handleRemoveAdd(partIndex,adBlockIndex,targetIndex)}
                              onClickUpButtonInAdBlock={(partIndex,adBlockIndex,targetIndex) => this.handleClickOnUpButtonInAdBlock(partIndex,adBlockIndex,targetIndex)}
                              onClickDownButtonInAdBlock={(partIndex,adBlockIndex,targetIndex) => this.handleClickOnDownButtonInAdBlock(partIndex,adBlockIndex,targetIndex)}/>
        })

        return (
            <div>
                <form className='ad-inserter-create-video' onSubmit={this.handleSubmit.bind(this)}>
                    <div className='ad-inserter-video-head'>
                        <p className='ad-inserter-h3-bold'>new video<span className='ad-inserter-h3'>{this.state.video.name}</span></p>
                        <p className='ad-inserter-h3'>duration<span className='ad-inserter-h3'>{changeFormat(this.calculateVideoDuration())}</span></p>
                    </div>
                    <div className='ad-inserter-lable-input-row'>
                        <label className='ad-inserter-input-label'
                               htmlFor='videoName'>video name</label>
                        <input className='ad-inserter-input'
                               id='videoName'
                               placeholder='name'
                               title='Insert a name for this video.'
                               type='text'
                               maxLength='1000'
                               required
                               value={this.state.video.name}
                               onChange={this.handleChangeName.bind(this)}/>
                    </div>

                    <div>{videoParts}</div>

                    <div className='ad-inserter-video-right-button'>
                        <button type='button'
                                className='ad-inserter-button-white-blue'
                                onClick={() => this.handleClickOnNewPart()}>
                            <i className="material-icons">add</i>video part
                        </button>
                    </div>

                    <div className='ad-inserter-right-button-group'>
                        <Link to={'/wp/wp-admin/admin.php?page=mpat-ad-insertion-all-ad-inserted-videos'}>
                            <button type='button'
                                    className='ad-inserter-button-white-blue'
                                    onClick={() => highlightNavigation('mpat-ad-insertion-new-video', 'mpat-ad-insertion-all-ad-inserted-videos')}>
                                <i className="material-icons">clear</i>cancel
                            </button>
                        </Link>
                        {
                            this.state.createVideo ?
                                <LoadingButton icon='add_to_queue' color='green' loadingMessage='create'/>
                                    :
                                <button type='submit'
                                        className='ad-inserter-button-green-white'>
                                    <i className="material-icons">add_to_queue</i>create
                                </button>
                        }
                    </div>
                </form>
            </div>
        )
    }
}

export default CreateVideo