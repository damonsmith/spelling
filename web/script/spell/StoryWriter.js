if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}
var templates = require('./templates.js');

module.exports = React.createClass({displayName: "exports",
	render: function() {
		return templates.StoryWriter.bind(this)();
	},
	
	handleError: function(data, status) {
    	console.debug("spell check error: ", status);
	},
	
	handleSubmit: function(event) {
		
		event.stopPropagation();
		event.preventDefault();
		var storyText = this.refs.storyText.getDOMNode().value;
		this.props.submitStory(this.refs.storyText.getDOMNode().value);
	}
});
