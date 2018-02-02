'use strict'

import React from 'react'

import CreateAd from './createAd'

class NewAd extends React.Component {
    render() {
        return (
            <div>
                <div className='ad-inserter-headline'>
                    <h2 className='ad-inserter-h2'>Create New Ad</h2>
                </div>
                <div className='ad-insertion-content-wrapper'>
                    <CreateAd></CreateAd>
                </div>
            </div>
        );
    }
}

export default NewAd