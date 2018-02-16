import React from 'react-frontend';
import componentLoader from "component-loader-frontend";

const component = componentLoader.getComponentByType('video');

componentLoader.registerComponent(
    'adinsertedvideo',
    { view: component.classes.view },
    {
        isStylable: false
    });
