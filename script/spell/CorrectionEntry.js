if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}

var SpellingService = require("./service/SpellingService.js");
var templates = require('./templates.js');

module.exports = React.createClass({
	
	convertSuggestionsToComboData: function(suggestions) {
		var suggestionsComboOptions = [];
		var wordMap = {};
		if (suggestions) {
			suggestions.forEach(function(item) {
				if (!wordMap[item.toLowerCase()]) {
					suggestionsComboOptions.push(item);
					wordMap[item.toLowerCase()] = true;
				}
			});
		}
		return suggestionsComboOptions;
	},
	
	getInitialState: function() {
		return {
			"word": this.props.correction.word,
			"correctionSearch": this.props.correction.word,
			"confirmedWord": "",
			"spellingSuggestions": [],
			"searchType": "endsWith",
			"selectedExampleWords": {}
		};
	},
	
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.correction.word !== this.state.word) {
			var newSuggestions = this.convertSuggestionsToComboData(nextProps.correction.suggestions);
			this.setState({
				"word": nextProps.correction.word,
				"correctionSearch": nextProps.correction.word,
				"correctionWord": "",
				"spellingSuggestions": newSuggestions,
				"resultsList": [],
				"selectedExampleWords": {}
			});
		}
	},

	
	/* **************************************************** */
	/* ** Functions for dealing with the CORRECTION word ** */
	/* *************************************************** */
	
	changeWord: function(event) {
		var newWord = event.target.value;
		
		this.setState({
			"word":  event.target.value
		});
	},
	
	getSpellingSuggestions: function(text, successHandler, errorHandler) {
		SpellingService.getWordSuggestions(text, successHandler, errorHandler);
	},

	getCorrectionData: function() {
		return {
			word: this.state.word,
			correctedWord: this.correctionWord,
			examples: this.state.selectedExampleWords
		}
	},
	
	selectCorrection: function(word) {
		delete this.state.selectedExampleWords[this.state.correctionWord];
		this.state.selectedExampleWords[word] = true;
		this.setState({
			"correctionWord": word,
			"correctionSearch": word,
			"selectedExampleWords": this.state.selectedExampleWords
		});
		this.refs.correctionSearch.toggleResultsVisible();
	},

	
	/* ******************************************* */
	/* ** Functions for finding an EXAMPLE word ** */
	/* ******************************************* */
	
	selectExampleWord: function(word) {
		
		this.state.selectedExampleWords[word] = true;
		this.setState({
			"selectedExampleWords": this.state.selectedExampleWords
		})
	},
	
	changeSearchType: function(event) {
		this.setState({
			"searchType": event.target.value
		});
	},
	
	exampleOptionSelected: function(word) {
		
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
	
	getExampleWords: function(text, successHandler, errorHandler) {
		SpellingService.getExamples(this.state.searchType, text, successHandler, errorHandler);
	},
	
	render: function() {
		return templates.CorrectionEntry.bind(this)();
	}
});