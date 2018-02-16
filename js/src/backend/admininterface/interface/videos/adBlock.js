import {changeFormat} from '../../helper/format'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import LoadingButton from '../loadingButton'

class AdBlock extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        const adOptions = this.props.allAdsArray.map((ad, index) => {
            return (
                <option
                    key={'ad-' + ad.id + 'adBlock-' + this.props.adBlockNumber}
                    value={index}>
                        {ad.name}
                </option>
            )
        })

        const buttonOrAddAd = this.props.adBlock.addAd ?
            <div className='ad-inserter-add-ad-to-ad-block-container'>
                {this.props.allAdsArray.length !== 0 ?
                    <div>
                        <div className='ad-inserter-ad-block-selector-container'>
                            <input type='radio'
                                   id='chooseAd'
                                   name='addAd'
                                   value='chooseAd'
                                   defaultChecked={this.props.adBlock.chooseAd}
                                   onClick={(event) => this.props.onClickRadioButtonOrLabelAdBlock(event.target.id)}/>
                            <label htmlFor='chooseAd'
                                   id='labelChooseAd'
                                   onClick={(event) => this.props.onClickRadioButtonOrLabelAdBlock(event.target.id)}>choose ad</label>
                            {
                                this.props.adBlock.chooseAd ?
                                    <select value={this.props.allAdsArray.indexOf(this.props.adBlock.chosenAd)}
                                            onChange={(event) => this.props.onChangeSelectAdBlock(event.target.value)}>
                                        {adOptions}
                                    </select>
                                    :
                                    null
                            }
                        </div>
                        <div>
                            <input type='radio'
                                   id='createAd'
                                   name='addAd'
                                   value='createAd'
                                   defaultChecked={!this.props.adBlock.chooseAd}
                                   onClick={(event) => this.props.onClickRadioButtonOrLabelAdBlock(event.target.id)}/>
                            <label htmlFor='createAd'
                                   id='labelCreateAd'
                                   onClick={(event) => this.props.onClickRadioButtonOrLabelAdBlock(event.target.id)}>add new ad</label>
                        </div>
                    </div>
                    :
                    null
                }
                {
                    !this.props.adBlock.chooseAd || this.props.allAdsArray.length === 0 ?
                        <div className='ad-inserter-ad-block-create-ad-container'>
                            <div className='ad-inserter-create-ad'>
                                <div className='ad-inserter-lable-input-row'>
                                    <label className='ad-inserter-input-label'>ad name</label>
                                    <input className='ad-inserter-input'
                                           id='name'
                                           placeholder='name'
                                           title='Insert a name for this ad.'
                                           type='text'
                                           maxLength='1000'
                                           required
                                           value={this.props.adBlock.addAdName}
                                           onChange={(event) => this.props.onChangeAddAdAdBlock(event.target.id, event.target.value)}/>
                                </div>
                                <div className='ad-inserter-lable-input-row'>
                                    <label className='ad-inserter-input-label'>dash url</label>
                                    <input className='ad-inserter-input'
                                           id='dash'
                                           placeholder='url (.mpd)'
                                           title='Insert url which links to a DASH file (.mpd).'
                                           type='url'
                                           pattern='.*\.mpd$'
                                           required
                                           value={this.props.adBlock.addAdDash}
                                           onChange={(event) => this.props.onChangeAddAdAdBlock(event.target.id, event.target.value)}/>
                                </div>
                                <div className='ad-inserter-lable-input-row'>
                                    <label className='ad-inserter-input-label'>hls url</label>
                                    <input className='ad-inserter-input'
                                           id='hls'
                                           placeholder='url (.m3u8)'
                                           title='Insert url which links to a HLS file (.m3u8).'
                                           type='url'
                                           pattern='.*\.m3u8$'
                                           value={this.props.adBlock.addAdHls}
                                           onChange={(event) => this.props.onChangeAddAdAdBlock(event.target.id, event.target.value)}/>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div className='ad-inserter-right-button-group'>
                    <button type='button'
                            className='ad-inserter-button-white-blue'
                            onClick={() => this.props.onClickAddAdOrCancelAdBlock()}>
                        <i className="material-icons">clear</i>cancel
                    </button>
                    {
                        this.props.adBlock.createAd ?
                            <LoadingButton icon='add_to_queue' color='green' loadingMessage={this.props.adBlock.chooseAd && this.props.allAdsArray.length !== 0 ? 'add' : 'add new ad'}/>
                            :
                            <button type='button'
                                    className='ad-inserter-button-green-white'
                                    onClick={(event) => this.props.onClickAddAdToAdBlock(event.target)}>
                                <i className="material-icons">add_to_queue</i>{this.props.adBlock.chooseAd && this.props.allAdsArray.length !== 0 ? 'add' : 'add new ad'}
                            </button>
                    }
                </div>
            </div>
            :
            <div className='ad-inserter-right-button-row'>
                <button type='button'
                        onClick={() => this.props.onClickAddAdOrCancelAdBlock()}
                        className='ad-inserter-button-white-blue'>
                    <i className='material-icons'>add</i>ad
                </button>
            </div>

        const ads = this.props.adBlock.ads.map((ad, index) => {
            return (
                <div key={'adInBlock-' + index + '-adBlock-' + this.props.adBlockNumber}
                     className='ad-inserter-ad-in-ad-block'>
                    <div>
                        <div className='ad-inserter-up-down-keys'>
                            <i className="material-icons up-button"
                               onClick={() => this.props.onClickUpButtonInAdBlock(index)}>
                                keyboard_arrow_up
                            </i>
                            <i className="material-icons down-button"
                               onClick={() => this.props.onClickDownButtonInAdBlock(index)}>
                                keyboard_arrow_down
                            </i>
                        </div>
                        <span>{ad.name}</span>
                    </div>
                    <div>
                        <span>{changeFormat(ad.duration)}</span>
                        <i className='material-icons'
                           data-tip='React-tooltip'
                           data-delay-show='500'
                           data-for={'delete-ad-' + index + '-from-adBlock-' + this.props.adBlockNumber + '-in-part-' + this.props.partNumber}
                           onClick={() => this.props.onClickRemoveAdAdBlock(index)}>
                            delete
                        </i>
                        <ReactTooltip place='top'
                                      type='dark'
                                      effect='solid'
                                      className='ad-inserter-react-tooltip'
                                      id={'delete-ad-' + index + '-from-adBlock-' + this.props.adBlockNumber + '-in-part-' + this.props.partNumber}
                                      delayShow={500}>
                            <span>remove ad from ad block</span>
                        </ReactTooltip>
                    </div>
                </div>
            )
        })

        return (
            <div className='ad-inserter-ad-block-container'>
                <div className='ad-inserter-ad-block-header'>
                    <p className='ad-inserter-h3-bold'>{this.props.adBlockNumber + '. ad block'}</p>
                    <i className='material-icons'
                       data-tip='React-tooltip'
                       data-delay-show='500'
                       data-for={'delete-ad-block' + this.props.adBlockNumber + '-in-part-' + this.props.partNumber}
                       onClick={() => this.props.onClickDeleteAdBlock()}>
                        delete
                    </i>
                    <ReactTooltip place='top'
                                  type='dark'
                                  effect='solid'
                                  className='ad-inserter-react-tooltip'
                                  id={'delete-ad-block' + this.props.adBlockNumber + '-in-part-' + this.props.partNumber}
                                  delayShow={500}>
                        <span>delete ad block</span>
                    </ReactTooltip>
                </div>
                <div className='ad-inserter-ad-block-time-subheader'>
                    <p className='ad-inserter-h3'>start<span>{changeFormat(this.props.adBlock.sec_in_part)}</span></p>
                    <p className='ad-inserter-h3'>block duration<span>{changeFormat(this.props.adBlock.duration)}</span></p>
                </div>
                <div className='ad-inserter-ads-in-ad-block'>
                    { ads }
                </div>
                { buttonOrAddAd }
            </div>
        )
    }
}

export default AdBlock