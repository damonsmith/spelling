if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}

var templates = require('./templates.js');

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			"searchText": "",
			"resultsVisible": false,
			"resultsLoading": false,
			"resultsLoaded": false,
			"searchResults": [],
			"resultsList": []
		};
	},
	
	componentWillMount: function() {
		if (typeof window !== 'undefined') {
			window.addEventListener("click", function(event) {
				if (this.state.resultsVisible) {
					if (event.target !== this.refs.dropdownList.getDOMNode() && 
					    event.target.parentNode !== this.refs.dropdownList.getDOMNode() && 
					    event.target.parentNode.parentNode !== this.refs.dropdownList.getDOMNode() && 
					    event.target !== this.refs.toggleResultsButton.getDOMNode()) {
						this.setState({
							"resultsVisible": false	
						});
					}
				}
			}.bind(this));
		}
	},
	
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			"resultsList": nextProps.resultsList
		});
	},
	
	changeWord: function(event) {
		var newWord = event.target.value;
		
		this.setState({
			"word":  event.target.value
		});
	},
	
	updateSuggestions: function() {
		SpellingService.check(
			this.state.word,
			this.handleNewSuggestions.bind(this),
			this.handleError.bind(this));
	},
	
	handleNewSuggestions: function(data) {
		if (data[0]) {
			var newSuggestions = this.convertSuggestionsToComboData(data[0].suggestions);
			this.setState({
				"spellingSuggestions": newSuggestions
			});
		}
	},
	
	keyUpHander: function(event) {
		if (event.keyCode === 13) {
			this.toggleResultsVisible();
		}
	},
	
	changeSearchText: function(event) {
		var text = event.target.value;
		this.setState({
			"searchText": event.target.value,
			"resultsLoaded": false,
			"resultsLoading": false,
			"resultsVisible": false
		});
	},
	
	toggleResultsVisible: function() {
		
		if (!this.state.resultsVisible && !this.state.resultsLoaded && !this.state.resultsLoading) {
			if (this.state.searchText) {
				SpellingService.getExamples(
					this.state.searchText,
					this.handleResultsReceived.bind(this), 
					this.handleError.bind(this));
			}
		}
		else if (this.state.resultsLoaded) {
			this.setState({
				"resultsVisible": !this.state.resultsVisible
			});
		}
	},
	
	handleResultsReceived: function(results) {
		
		this.setState({
			"resultsVisible": true,
			"resultsLoaded": true,
			"resultsLoading": false,
			"resultsList": results
		});
	},
	
	handleError: function() {
		
	},
	
	render: function() {
		return templates.CorrectionEntry.bind(this)();
	}
});