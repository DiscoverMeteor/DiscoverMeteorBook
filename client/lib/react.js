// Temporary file until the new react-runtime does this for us
import React from 'react';
window.React = React;

//We need this npm package to replace React.createReactClass
import createReactClass from 'create-react-class';

console.log("react.js file was loaded 🎉", createReactClass);