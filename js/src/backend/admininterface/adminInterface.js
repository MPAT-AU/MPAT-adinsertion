'use strict'

import React    from 'react'
import ReactDOM from 'react-dom'

import { InterfaceRoot } from './interface/interface'

function displayAdminInterface() {

    let rootObject = document.getElementById('reactRoot')

    if(!rootObject)
        return

    ReactDOM.render(<InterfaceRoot/>, rootObject)
}

document.addEventListener("DOMContentLoaded", displayAdminInterface);

