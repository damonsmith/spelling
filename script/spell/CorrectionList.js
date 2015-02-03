if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}

var templates = require('./templates.js');

module.exports = React.createClass({
	
	render: function() {
		return templates.CorrectionList.bind(this)();
	},
	
	blankRow: {word: "", suggestions: []},
	
	getInitialState: function() {
		return {
			"corrections": this.convertCorrectionsDataToComponentState(this.props.corrections),
			"exampleWords": [],
		}
	},
	
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			"corrections": this.convertCorrectionsDataToComponentState(nextProps.corrections)
		});
	},
	
	//Fixed to always be 5 entries. Only lists each error once.
	// - alreadyFound is a map of all the words found so far
	// - corrections is the data that we get back from the server, with all the spelling errors
	//The loop looks complex because it steps through the 5 state items and the corrections 
	//separately so that it can remove duplicates.
	convertCorrectionsDataToComponentState: function(corrections) {
		var state = [];
		var stateIndex = 0;
		var correctionsIndex = 0;
		var alreadyFound = {};
		var word = "";
		while (stateIndex < 10) {
			if (!corrections[correctionsIndex]) {
				state[stateIndex] = this.blankRow;
				stateIndex++;
			}
			else {
				word = corrections[correctionsIndex].word;
				if (!alreadyFound[word]) {
					alreadyFound[word] = true;
					state[stateIndex] = corrections[correctionsIndex];
					stateIndex++;
					correctionsIndex++;
				}
				else {
					correctionsIndex++;
				}
			}
		}
		return state;
	},
	
	showResults: function() {
		var correctionDataList = [];
		correctionDataList.push(this.refs.correction0.getCorrectionData());
		correctionDataList.push(this.refs.correction1.getCorrectionData());
		correctionDataList.push(this.refs.correction2.getCorrectionData());
		correctionDataList.push(this.refs.correction3.getCorrectionData());
		correctionDataList.push(this.refs.correction4.getCorrectionData());
		correctionDataList.push(this.refs.correction5.getCorrectionData());
		correctionDataList.push(this.refs.correction6.getCorrectionData());
		correctionDataList.push(this.refs.correction7.getCorrectionData());
		correctionDataList.push(this.refs.correction8.getCorrectionData());
		correctionDataList.push(this.refs.correction9.getCorrectionData());
		

		this.refs.resultsList.setState({
			"visible": true,
			"results": correctionDataList 
		});
	},
	
	hideResults: function() {
		this.refs.resultsList.setState({
			"visible": false
		})
	}
	
});