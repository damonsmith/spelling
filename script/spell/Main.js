
var React = require('react');
var addons = require('react-addons');

var templates = require("../../build/spell/templates.js");

console.log(templates.App);
var html = React.renderToString(templates.App);
console.log(html);
