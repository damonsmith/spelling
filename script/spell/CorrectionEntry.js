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
			"confirmedWordLoading": false,
			"selectedExampleWords": {},
			"correctionWord": {"label": "foo", "value": "foo"}
		};
	},
	
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.correction.word !== this.state.word) {
			var newSuggestions = this.convertSuggestionsToComboData(nextProps.correction.suggestions);
			this.setState({
				"word": nextProps.correction.word,
				"spellingSuggestions": newSuggestions,
				"resultsList": [],
				"confirmedWordLoading": false,
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
	
	selectExampleWord: function(word) {
		
		this.state.selectedExampleWords[word] = true;
		this.setState({
			selectedExampleWords: this.state.selectedExampleWords
		})
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
	
	correctionChanged: function(label, value) {
		this.removeExampleWord(this.state.correctionWord);
		if (value) {
			this.selectExampleWord(value);
		}
		this.setState({"correctionWord": value});
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
	
	getCorrectionData: function() {
		return {
			word: this.state.word,
			correctedWord: this.refs.suggestionsCombo.state._textValue,
			examples: this.state.selectedExampleWords
		}
	},
	
	render: function() {
		return templates.CorrectionEntry.bind(this)();
	}
});