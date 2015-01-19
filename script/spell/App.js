namespace("spell");

spell.App = React.createClass({
	
	blankRow: {word: "", suggestions: []},
	
	render: function() {
		return templates.App.bind(this)();
	},
	
	getInitialState: function() {
		return {
			corrections: [
			]
		};
	},
	
	submitStory: function(text) {
		spell.service.SpellingService.check(
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

addEventListener("load", function() {
	React.render(
		React.createElement(spell.App, {}),
		document.getElementById('app-section')	
	);
});
