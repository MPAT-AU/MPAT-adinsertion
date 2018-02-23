/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lacaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/

import componentLoader from 'component-loader-backend'
import React from 'react-backend'

import autobind from 'class-autobind'

function noSubmitOnEnter(event) {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
        event.preventDefault();
        return false;
    }
}

function editView(params) {
    const {id, data, changeAreaContent} = params
    return (
        <AdInsertedVideoEdit id={id} {...data} changeAreaContent={changeAreaContent}/>
    )
}

function preview(content = {}) {
    const thumbnail = (content.data) ? (content.data.thumbnail) : ''
    return (
        <div className="mpat-content-preview videocontent-preview">
            <div className="mpat-image-preview" style={{backgroundImage: `url(${thumbnail})`}}/>
        </div>
    )
}


class AdInsertedVideoEdit extends React.PureComponent {

    static defaultProps = {
        url: '',
        autostart: false,
        loop: false,
        fullscreen: false,
        zoom: false,
        playIcon: true,
        showNavBar: true,
        thumbnail: ''
    }

    constructor(props) {
        super(props)
        this.state = {
            adInsertedVideoArray: [],
            videosAvailable: false,
            selectedVideo: this.props.url
        }
        autobind(this)
        this.getAdInsertedVideoArray()
    }

    getAdInsertedVideoArray() {
        this.getVideosForDropdown().then(result => {
            if(result.length !== 0) {
                const sortedVideos = result.sort((a, b) => {
                    const nameA = a.name.toUpperCase()
                    const nameB = b.name.toUpperCase()
                    if (nameA < nameB) return -1
                    if (nameA > nameB) return 1
                    return 0
                })
                this.setState({
                    adInsertedVideoArray: sortedVideos,
                    videosAvailable: true
                })
            } else {
                this.setState({
                    adInsertedVideoArray: result,
                    videosAvailable: false
                })
            }
        }, err => {
            console.log('Error ', err)
        })
    }

    getVideosForDropdown() {
        return new Promise((resolve, reject) =>
            $.ajax({
                url: env.document_root +'/app/plugins/mpat-adinsertion/php/DBHandler.php',
                data: {
                    function: 'getVideosForDropdown',
                    path: env.path
                },
                type: 'get',
                success: function(data) {
                    resolve(JSON.parse(data));
                },
                error: function (error) {
                    reject();
                }
            }));
    }

    handleChangeOnDropdown(event) {
        const url = event.target.value
        this.setState({selectedVideo: url})
        this.setContent('url', url)
    }

    setContent(key, value) {
        this.props.changeAreaContent({
            [key]: value
        })
    }

    render() {

        const {autostart, loop, fullscreen, zoom, playIcon, showNavBar, thumbnail} = this.props

        let videoOptions = [<option key={'ad-insertion-select-video'} value={''}>select</option>]

        videoOptions.push(this.state.adInsertedVideoArray.map(video => {
            return (<option key={video.id} value={video.output_dash_url}>{video.name}</option>)
        }))

        const videoAdInsertionContent = (
            <div className="component editHeader">
                <h2>Ad Inserted Video Settings</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <label>Ad Inserted Video Source: </label>
                        </td>
                        <td>
                            <select value={this.state.selectedVideo} onChange={this.handleChangeOnDropdown.bind(this)}>
                                {videoOptions}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Thumbnail: </label>
                        </td>
                        <td>
                            <input
                                type="text"
                                id="videoThumbnailInput"
                                placeholder="THUMBNAIL URL"
                                value={thumbnail}
                                onKeyPress={noSubmitOnEnter}
                                onChange={e => this.setContent('thumbnail', e.target.value)}
                            />
                            <span className="padded_or">OR</span>
                            <button type="button" target="videoThumbnailInput"
                                    className="button mpat-insert-media white_blue" data-type="image">
                                choose Thumbnail
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Autoplay: </label>
                        </td>
                        <td>
                            <input type="checkbox" checked={autostart}
                                   onChange={e => this.setContent('autostart', e.target.checked)}/>
                            &nbsp;(Start playback when page opens)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Repeat: </label>
                        </td>
                        <td>
                            <input type="checkbox" checked={loop}
                                   onChange={e => this.setContent('loop', e.target.checked)}/>
                            &nbsp;(Loop)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Fullscreen start: </label>
                        </td>
                        <td>
                            <input type="checkbox" checked={fullscreen}
                                   onChange={e => this.setContent('fullscreen', e.target.checked)}/>
                            &nbsp;(Start video in fullscreen)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Remove Black Bars: </label>
                        </td>
                        <td>
                            <input type="checkbox" checked={zoom}
                                   onChange={e => this.setContent('zoom', e.target.checked)}/>
                            &nbsp;(Zoom video to remove black bars)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Play icon</label>
                        </td>
                        <td>
                            <input type="checkbox" checked={playIcon}
                                   onChange={e => this.setContent('playIcon', e.target.checked)}/>
                            &nbsp;(show play icon when video is ready)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Show navigation bar: </label>
                        </td>
                        <td>
                            <input type="checkbox" checked={showNavBar}
                                   onChange={e => this.setContent('showNavBar', e.target.checked)}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )

        const noVideosAvailable = (
            <div className="component editHeader">
                <h2>Ad Inserted Video Settings</h2>
                <p>No ad inserted videos available now. Create some with MPAT Ad-Insertion Plugin.</p>
            </div>
        )

        return this.state.videosAvailable ? videoAdInsertionContent : noVideosAvailable
    }
}


componentLoader.registerComponent(
    'adinsertedvideo', {
        edit: editView,
        preview
    }, {
        isHotSpottable: true,
        isScrollable: false,
        hasNavigableGUI: true,
        isStylable: false
    }, {
        navigable: true
    },
    []
)

