if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}

var StoryWriter = require("./StoryWriter.js");
var CorrectionList = require("./CorrectionList.js");
var CorrectionEntry = require("./CorrectionEntry.js");
var Combobox = require("./Combobox.js");
var ResultsList = require("./ResultsList.js");



exports.App = function() {

	return (
		React.createElement("span", null, 
			React.createElement("div", {className: "column column-1-3"}, 
				React.createElement("article", null, 
					React.createElement("div", null, 
						React.createElement("header", null, 
							"Student Text"
						), 
						React.createElement(StoryWriter, {submitStory: this.submitStory}), 
						React.createElement("div", {className: "clear"})
					)
				)
			), 
	
			React.createElement("div", {className: "column column-2-3"}, 
				React.createElement("article", null, 
					React.createElement("div", null, 
						React.createElement("div", {className: "word-column"}, 
							React.createElement(CorrectionList, {corrections: this.state.corrections})
						), 
						React.createElement("div", {className: "clear"})
					)
				)
			)
		)
	)
	
};


exports.StoryWriter = function() {
	return (
		React.createElement("div", null, 
			React.createElement("form", {onSubmit: this.handleSubmit, className: "large"}, 
				React.createElement("textarea", {
					ref: "storyText", 
					autoComplete: "off", autoCorrect: "off", autoCapitalize: "off", spellCheck: "false", 
					placeholder: ""
				}), 
				React.createElement("button", null, "Analyse Text")
			)
		)
	);
};


exports.CorrectionList = function() {
	
	return (
		React.createElement("div", null, 
			React.createElement("table", {className: "correctionsTable", cellSpacing: "0"}, 
				React.createElement("thead", null, 
					React.createElement("tr", null, 
						React.createElement("th", null, "Student Attempt"), 
						React.createElement("th", null, "Word Confirmed"), 
						React.createElement("th", null, "Word Search")
					)
				), 
				React.createElement(CorrectionEntry, {ref: "correction0", correction: this.state.corrections[0]}), 
				React.createElement(CorrectionEntry, {ref: "correction1", correction: this.state.corrections[1]}), 
				React.createElement(CorrectionEntry, {ref: "correction2", correction: this.state.corrections[2]}), 
				React.createElement(CorrectionEntry, {ref: "correction3", correction: this.state.corrections[3]}), 
				React.createElement(CorrectionEntry, {ref: "correction4", correction: this.state.corrections[4]}), 
				React.createElement(CorrectionEntry, {ref: "correction5", correction: this.state.corrections[5]}), 
				React.createElement(CorrectionEntry, {ref: "correction6", correction: this.state.corrections[6]}), 
				React.createElement(CorrectionEntry, {ref: "correction7", correction: this.state.corrections[7]}), 
				React.createElement(CorrectionEntry, {ref: "correction8", correction: this.state.corrections[8]}), 
				React.createElement(CorrectionEntry, {ref: "correction9", correction: this.state.corrections[9]})
						
			), 
			React.createElement("div", {className: "clear"}), 
			React.createElement("div", {className: "centering"}, 
				React.createElement("button", {className: "large", 
					onClick: this.showResults}, "Print list")
			), 
			React.createElement(ResultsList, {ref: "resultsList", visible: this.state.resultsVisible, results: this.state.correctionResults})
		)
	);
};

exports.ResultsList = function() {
	
	if (this.state.visible) {
		
		var i, words, wordEntry, rows = [];
		for (i=0; i<this.state.results.length; i++) {
			wordEntry = this.state.results[i];
			words = [];
			for (word in wordEntry.examples) {
				words.push(React.createElement("div", null, word));
			}
			
			rows.push(
				React.createElement("tr", null, 
					React.createElement("td", null, 
						React.createElement("div", null, 
							words
						)
					)
				));
		}
		
		return (
			React.createElement("span", null, 
				React.createElement("div", {className: "results-display-lightbox", onClick: this.hideResults}, 
					React.createElement("table", {className: "results-display-table", onClick: this.stopPropagation}, 
						React.createElement("thead", null, 
							React.createElement("tr", null, 
								React.createElement("th", null, "Word List")	
							)
						), 
						React.createElement("tbody", null, 
							rows
						)
					)
				)
			)
		);
	}
	else {
		return (React.createElement("div", null))
	}
};

exports.CorrectionEntry = function() {
	
	var classes = {listState: (this.state.resultsVisible ? "" : "hidden")};
	var word;
	var resultsList = [];
	
	this.state.resultsList.forEach(function(word) {
		resultsList.push(React.createElement("div", {key: "rl" + word, onClick: function(){this.selectExampleWord(word)}.bind(this)}, word, React.createElement("div", {className: "add-word-button"})));
	}.bind(this));
	
	selectedExampleWords = [];
	Object.keys(this.state.selectedExampleWords).forEach(function(word) {
		selectedExampleWords.push(React.createElement("div", {key: "ew" + word, onClick: function(){this.removeExampleWord(word)}.bind(this)}, word));
	}.bind(this));
	
	return (
		React.createElement("tbody", null, 
			React.createElement("tr", {className: "input-fields-row"}, 
				React.createElement("td", null, 
					React.createElement("input", {className: "disabled", value: this.state.word, onChange: this.changeWord, onBlur: this.updateSuggestions, disabled: "true"})
				), 
				React.createElement("td", null, 
					React.createElement(Combobox, {ref: "suggestionsCombo", data: this.state.spellingSuggestions, onChange: this.correctionChanged})
				), 
				React.createElement("td", null, 
					React.createElement("div", {className: "example-search-container"}, 
						React.createElement("select", {onChange: this.changeSearchType, value: this.state.searchType}, 
							React.createElement("option", {value: "contains"}, "Contains.."), 
							React.createElement("option", {value: "startsWith"}, "Starts with.."), 
							React.createElement("option", {value: "endsWith"}, "Ends with..")
						), 
						React.createElement("input", {className: "example-search", placeholder: "eg: ing", value: this.state.searchText, onChange: this.changeSearchText, onKeyUp: this.keyUpHander}), 
						React.createElement("button", {ref: "toggleResultsButton", className: "small results-search", onClick: this.toggleResultsVisible}), 
						React.createElement("div", {className: classes.listState + ' ' + 'positioner'}, 
							React.createElement("div", {ref: "dropdownList", className: "dropdown-list"}, 
								resultsList
							)
						)
					)
				)
			), 
			React.createElement("tr", {className: "example-words-row"}, 
				React.createElement("td", {colSpan: "3"}, 
					React.createElement("h2", {className: "exampleWordsTitle"}, "Word List:"), 
					selectedExampleWords
				)
			)
		)
	);
};


