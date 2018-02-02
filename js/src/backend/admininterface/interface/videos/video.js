'use strict'

import React from 'react'

class Video extends React.Component {
    render() {
        return (
            <div className='content-editor-container'>
                <h3>Video</h3>
                <Part></Part>
            </div>
        );
    }
}

class Part extends React.Component {
    render() {
        return (
            <div>
                Part
                <Ad></Ad>
                <Ad></Ad>
            </div>
        );
    }
}

class Ad extends React.Component {
    render() {
        return (
            <div>Ad</div>
        );
    }
}

export default Video