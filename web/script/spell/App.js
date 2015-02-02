
var SpellingService = require("./service/SpellingService.js");
if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}
var templates = require('./templates.js');

var App = React.createClass({displayName: "App",
	
	blankRow: {word: "", suggestions: []},
	
	render: function() {
		console.log("RENDER");
		return templates.App.bind(this)();
	},
	
	getInitialState: function() {
		return {
			corrections: [
			]
		};
	},
	
	submitStory: function(text) {
		SpellingService.check(
			text, 
			this.updateSpellingCorrections.bind(this), 
			this.handleError.bind(this));
	},
	
	updateSpellingCorrections: function(data) {
		this.setState({
			corrections: data
		});
	},
	
	handleError: function(data, status) {
    	console.debug("spell check error: ", status);
	}
	
	
});

module.exports = App;

if (typeof(window) !== 'undefined') {
	window.addEventListener("load", function() {
		React.render(
			React.createElement(App, {}),
			document.getElementById('app-section')	
		);
	});
}
