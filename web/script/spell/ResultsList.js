if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}
var templates = require('./templates.js');

module.exports = React.createClass({displayName: "exports",
	
	render: function() {
		return templates.ResultsList.bind(this)();
	},
	
	getInitialState: function() {
		return {
			"visible": this.props.visible,
			"results": [] 
		}
	},
	
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			visible: nextProps.visible
		});
	},
	
	hideResults: function() {
		this.setState({
			visible: false
		});
	},
	
	stopPropagation: function(event) {
		event.stopPropagation();
	}
});