'use strict'

import React from 'react'

import { getAdsWithCount, updateAd, deleteAd } from '../../handler/DBHandler'
import LoadingButton from '../loadingButton'
import { waitTwoSeconds } from '../demoHelper'
import LoadingScreen from '../loadingScreen'
import NoData from '../noData'

class AdTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adDataArray: [],
            loadData: true
        }
        // this.getAdDataArray()

        // only for demo purposes
        waitTwoSeconds(1000).then(() =>
            this.getAdDataArray()
        )
    }

    getAdDataArray() {
        getAdsWithCount().then(result => {
            result = result.map((ad) => {
                ad.editOpen = false
                ad.saveAd = false
                ad.deleteAd = false
                return ad
            })
            this.setState({
                adDataArray: result,
                loadData: false
            })
        }, err => {
            console.log('Error ', err)
        })
    }

    handleChange(index, event) {
        const adDataArray = this.state.adDataArray
        switch (event.target.id) {
            case 'name' : {
                adDataArray[index].name = event.target.value
                break
            }
            case 'dash' : {
                adDataArray[index].dash_url = event.target.value
                break
            }
            case 'hls' : {
                adDataArray[index].hls_url = event.target.value
                break
            }
            default : break
        }
        this.setState({adDataArray: adDataArray})
    }

    handleClickOnEditCloseIcon(index) {
        this.setEditOpen(index)
    }

    setEditOpen(index) {
        const adDataArray = this.state.adDataArray
        adDataArray[index].editOpen = !adDataArray[index].editOpen
        this.setState({adDataArray: adDataArray})
    }

    handleSubmit(index, event) {
        event.preventDefault();
        this.setSaveAd(index)
        const json = this.getJsonForSubmit(index)
        // updateAd(this.state.adDataArray[index].id, json)
        //     .then(result => {
        //         this.setSaveAd(index)
        //         if (result) {
        //             this.setEditOpen(index)
        //         } else {
        //             console.log('Error')
        //         }
        //     })

        // only for demo purposes
        waitTwoSeconds(2000).then(() =>
            updateAd(this.state.adDataArray[index].id, json)
                .then(result => {
                    this.setSaveAd(index)
                    if (result) {
                        this.setEditOpen(index)
                    } else {
                        console.log('Error')
                    }
                })
        )
        return false
    }

    setSaveAd(index) {
        const adDataArray = this.state.adDataArray
        adDataArray[index].saveAd = !adDataArray[index].saveAd
        this.setState({adDataArray: adDataArray})
    }

    handleDelete(index) {
        this.setDeleteAd(index)
        // deleteAd(this.state.adDataArray[index].id)
        //     .then(result => {
        //         this.setDeleteAd(index)
        //         if (result) {
        //             this.removeAd(index)
        //         } else {
        //             console.log('Error')
        //         }
        //     })

        // only for demo purposes
        waitTwoSeconds(1000).then(() =>
            deleteAd(this.state.adDataArray[index].id)
                .then(result => {
                    this.setDeleteAd(index)
                    if (result) {
                        this.removeAd(index)
                    } else {
                        console.log('Error')
                    }
                })
        )
    }

    removeAd(index) {
        const adDataArray = this.state.adDataArray
        const newAdDataArray = adDataArray.slice(0,index).concat(adDataArray.slice(index + 1))
        this.setState({adDataArray: newAdDataArray})
    }

    setDeleteAd(index) {
        const adDataArray = this.state.adDataArray
        adDataArray[index].deleteAd = !adDataArray[index].deleteAd
        this.setState({adDataArray: adDataArray})
    }

    getJsonForSubmit(index) {
        return {
            name: this.state.adDataArray[index].name,
            dash_url: this.state.adDataArray[index].dash_url,
            hls_url: this.state.adDataArray[index].hls_url
        }
    }

    render() {
        const tableContent = this.state.adDataArray.map((ad, index) => {
            return [
                <tr key={index + 'ad-table-view'}
                    className={ this.state.adDataArray[index].editOpen ? 'active-row' : null}>
                    <td className='ad-inserter-td ad-inserter-table-cell-left ad-inserter-bold'>{ad.name}</td>
                    <td className='ad-inserter-th ad-inserter-table-cell-center ad-inserter-bold ad-inserter-table-data-fixed-width-uses'>{ad.uses}</td>
                    {
                        !this.state.adDataArray[index].editOpen ?
                        <td className='ad-inserter-table-data-fixed-width-icon'><i className="material-icons material-icon-as-button" onClick={this.handleClickOnEditCloseIcon.bind(this, index)}>mode_edit</i></td>
                            :
                        <td className='ad-inserter-table-data-fixed-width-icon'><i className="material-icons material-icon-as-button key-down" onClick={this.handleClickOnEditCloseIcon.bind(this, index)}>expand_more</i></td>
                    }
                </tr>,
                <tr>
                    <td colSpan='3'
                        className={ this.state.adDataArray[index].editOpen ? 'ad-inserter-table-edit-ad-view active' : 'ad-inserter-table-edit-ad-view' }>
                        {
                            this.state.adDataArray[index].editOpen ?
                            <form className='ad-insertion-content-wrapper' onSubmit={this.handleSubmit.bind(this, index)}>
                                <div className='ad-inserter-lable-input-row'>
                                    <label className='ad-inserter-input-label'>ad name</label>
                                    <input className='ad-inserter-input'
                                           id='name'
                                           placeholder='name'
                                           title='Insert a name for this ad.'
                                           type='text'
                                           maxLength='20'
                                           required
                                           value={this.state.adDataArray[index].name}
                                           onChange={this.handleChange.bind(this, index)}/>
                                </div>
                                <div className='ad-inserter-lable-input-row'>
                                    <label className='ad-inserter-input-label'>dash url</label>
                                    <input className='ad-inserter-input'
                                           id='dash'
                                           placeholder='url (.mpd)'
                                           title='Insert url which links to an DASH file (.mpd).'
                                           type='url'
                                           pattern='.*\.mpd$'
                                           required
                                           value={this.state.adDataArray[index].dash_url}
                                           onChange={this.handleChange.bind(this, index)}/>
                                </div>
                                <div className='ad-inserter-lable-input-row'>
                                    <label className='ad-inserter-input-label'>hls url</label>
                                    <input className='ad-inserter-input'
                                           id='hls'
                                           placeholder='url (.m3u8)'
                                           title='Insert url which links to an HLS file (.m3u8).'
                                           type='url'
                                           pattern='.*\.m3u8$'
                                           required
                                           value={this.state.adDataArray[index].hls_url}
                                           onChange={this.handleChange.bind(this, index)}/>
                                </div>
                                <div className='ad-inserter-right-button-group'>
                                    {
                                        this.state.adDataArray[index].deleteAd ?
                                            <LoadingButton icon='delete' color='white' loadingMessage='delete'/>
                                            :
                                            <button type='button'
                                                    className='ad-inserter-button-white-blue'
                                                    onClick={this.handleDelete.bind(this, index)}>
                                                <i className="material-icons">delete</i>delete
                                            </button>
                                    }
                                    {
                                        this.state.adDataArray[index].saveAd ?
                                        <LoadingButton icon='save' color='green' loadingMessage='save'/>
                                            :
                                        <button type='submit'
                                                className='ad-inserter-button-green-white'>
                                            <i className="material-icons">save</i>save
                                        </button>
                                    }
                                </div>
                            </form>
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
                this.state.adDataArray.length === 0 ?
                <NoData datatype='ads'
                        linkToNew='/wp/wp-admin/admin.php?page=mpat-ad-insertion-new-ad'
                        from='mpat-ad-insertion-all-ads'
                        to='mpat-ad-insertion-new-ad'
                        buttonText='new ad'/>
                :
                <table className='ad-inserter-table'>
                    <thead className='ad-inserter-thead'>
                    <tr>
                        <th className='ad-inserter-th ad-inserter-table-cell-left'>name</th>
                        <th className='ad-inserter-th ad-inserter-table-cell-center'>uses</th>
                        <th></th>
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

export default AdTable