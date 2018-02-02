'use strict'

import React from 'react'
import {Link} from 'react-router-dom'
import {highlightNavigation} from '../helper/wpRouting'

class NoData extends React.Component {

    render() {
        return (
            <div className='ad-inserter-no-data'>
                <p>no {this.props.datatype} created yet create some</p>
                <Link to={this.props.linkToNew}>
                    <button className='ad-inserter-button-white-blue'
                            onClick={() => highlightNavigation(this.props.from,this.props.to)}>
                        <i className="material-icons">add</i>{this.props.buttonText}
                    </button>
                </Link>
            </div>
        );
    }
}

export default NoData