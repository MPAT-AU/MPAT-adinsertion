'use strict'

// import area
import React    from 'react'
import ReactDOM from 'react-dom'

import { InterfaceRoot } from './interface/interface'

// variables area
const version = '1.0.0'

/**
 *   This is the main class for the admin part, of this plugin.
 *   It collects all information which are necessary for the view
 *   and inits the backend.
 *
 *   Available functions:
 *       - init(wp, root) - <wp> is the WordPress API and <root> the id of the
 *                          html element where the view will be placed.
 *
 *   NOTE: add this class to the window object, otherwise it is not accessible
 **/
class AdminInterface {
    constructor() {
        this.version          = version
        window.AdminInterface = this
    }

    /**
     *   wp: WordPress API
     *   root: id of the div where the interface will be placed
     **/
    init(wp, root) {
        let rootObject = document.getElementById(root)
        this.wp        = wp

        if(!rootObject)
            return

        ReactDOM.render(<InterfaceRoot/>, rootObject)
    }
}

module.exports = new AdminInterface()
