'use strict'


import React from 'react'
import CreateVideo from './createVideo'

class NewVideo extends React.Component {
    render() {
        return (
            <div>
                <div className='ad-inserter-headline'>
                    <h2 className='ad-inserter-h2'>Create New Video</h2>
                </div>
                <div className='ad-insertion-content-wrapper'>
                    <CreateVideo></CreateVideo>
                </div>
            </div>
        );
    }
}

export default NewVideo