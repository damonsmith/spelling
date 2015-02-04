if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}

var SpellingService = require("./service/SpellingService.js");
var templates = require('./templates.js');

module.exports = React.createClass({displayName: "exports",
	
	convertSuggestionsToComboData: function(suggestions) {
		var suggestionsComboOptions = [];
		var wordMap = {};
		if (suggestions) {
			suggestions.forEach(function(item) {
				if (!wordMap[item.toLowerCase()]) {
					suggestionsComboOptions.push({"label": item, "value": item});
					wordMap[item.toLowerCase()] = true;
				}
			});
		}
		return suggestionsComboOptions;
	},
	
	getInitialState: function() {
		return {
			"word": this.props.correction.word,
			"spellingSuggestions": this.convertSuggestionsToComboData(this.props.correction.suggestions),
			"searchType": "endsWith",
			"searchText": "",
			"resultsList": [],
			"confirmedWordLoading": false,
			"resultsVisible": false,
			"resultsLoading": false,
			"resultsLoaded": false,
			"selectedExampleWords": {},
			"correctionWord": {"label": "foo", "value": "foo"}
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
		if (nextProps.correction.word !== this.state.word) {
			var newSuggestions = this.convertSuggestionsToComboData(nextProps.correction.suggestions);
			this.setState({
				"word": nextProps.correction.word,
				"spellingSuggestions": newSuggestions,
				"resultsVisible": false,
				"searchText": "",
				"resultsList": [],
				"confirmedWordLoading": false,
				"resultsLoading": false,
				"resultsLoaded": false,
				"selectedExampleWords": {}
			});
			this.refs.suggestionsCombo.setState({"_textValue": ""});
		}
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
		console.debug("data: ", data);
	},
	
	changeSearchType: function(event) {
		this.setState({
			"searchType": event.target.value
		});
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
	
	correctionChanged: function(label, value) {
		this.removeExampleWord(this.state.correctionWord);
		if (value) {
			this.selectExampleWord(value);
		}
		this.setState({"correctionWord": value});
	},
	
	selectExampleWord: function(word) {
		
		this.state.selectedExampleWords[word] = true;
		this.setState({
			selectedExampleWords: this.state.selectedExampleWords
		})
	},
	
	removeExampleWord: function(word) {
		
		delete this.state.selectedExampleWords[word];
		this.setState({
			selectedExampleWords: this.state.selectedExampleWords
		})
	},
	
	toggleResultsVisible: function() {
		
		if (!this.state.resultsVisible && !this.state.resultsLoaded && !this.state.resultsLoading) {
			if (this.state.searchText) {
				SpellingService.getExamples(
					this.state.searchType, 
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
	
	getCorrectionData: function() {
		return {
			word: this.state.word,
			correctedWord: this.refs.suggestionsCombo.state._textValue,
			examples: this.state.selectedExampleWords
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