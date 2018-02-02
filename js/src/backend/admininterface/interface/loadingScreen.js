'use strict'

import React from 'react'

class LoadingScreen extends React.Component {

    render() {
        return (
            <div className='ad-inserter-loading-screen-container'>
                <div>
                    <i className="material-icons">cached</i>Loading
                </div>
            </div>
        );
    }
}

export default LoadingScreen