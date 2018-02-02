'use strict'

import React from 'react'

class LoadingButton extends React.Component {

    render() {
        return (
            <div className={ this.props.color === 'green' ? 'ad-inserter-loading-button-container' : 'ad-inserter-loading-button-container white'}>
                <i className="material-icons">{this.props.icon}</i>{this.props.loadingMessage}
            </div>
        );
    }
}

export default LoadingButton