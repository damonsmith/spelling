(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./service/SpellingService.js":7,"./templates.js":8,"react":undefined}],2:[function(require,module,exports){
/** @jsx React.DOM */
/* jshint newcap: false */
if (typeof(window) == 'undefined') {
	var React = require('react');
	var addons = require('react-addons');
}
else {
	var React = window.React;
	var addons = React.addons;
}
var cx = addons.classSet;

/**
 * @const CSS Component prefix
 */
var CSS_PREFIX = 'Combobox';

/**
 * Partial
 * @see http://underscorejs.org/#partial
 */
var _partial = function(func) {
    var boundArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        var position = 0;
        var args = boundArgs.slice();
        while (position < arguments.length) {
            args.push(arguments[position++]);
        }
        return func.apply(this, args);
    };
};

/**
 * Generate CSS class for Element
 * @param  {string} blockName
 * @param  {string} elemName  Element name
 * @return {string}           CSS class for Element
 */
var _clsElem = function(blockName, elemName) {
    var className = blockName + '__' + elemName;
    return className;
};

/**
 * It is _clsState() with predefined blockName=CSS_PREFIX
 * @see _clsElem
 */
var clsElem = _partial(_clsElem, CSS_PREFIX);

/**
 * Generate CSS class for Block or Element state (modificator)
 * @param  {string} blockName Block name or Element name generated by clsElem
 * @param  {string} stateName
 * @param  {string} [stateValue]
 * @return {string}             CSS class for Block or Element with state
 */
var clsState = function(blockName, stateName, stateValue) {
    var className = blockName + '_' + stateName +
                    ((stateValue == null) ? '' : '-' +  stateValue);
    return className;
};

/**
 * It is clsState() with predefined blockName=CSS_PREFIX
 * @see clsState
 */
var clsBlockState = _partial(clsState, CSS_PREFIX);

/**
 * Combo box option UI component
 * @class
 */
var ComboboxOption = React.createClass({displayName: "ComboboxOption",
    // Default component methods
    propTypes: {
        selected: React.PropTypes.bool,
        children: React.PropTypes.string.isRequired,
        value: React.PropTypes.object,
        onClick: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            selected: false,
            children: "",
            value: null
        };
    },

    render: function() {
        var cls = {};
        cls[clsElem('dropdownOption')] = true;
        cls[clsState(clsElem('dropdownOption'), 'selected')] = this.props.selected;

        return (
            React.createElement("li", {className: cx(cls), onClick: this.onClick}, 
                this.props.children
            )
        );
    },

    onClick: function(evt) {
        this.props.onClick(evt, this.props.label, this.props.value);
        return false;
    }
});

/**
 * Combo box UI component
 * @class
 */
module.exports = React.createClass({displayName: "exports",
    // Default component methods
    propTypes: {
        // Default data items
        data: React.PropTypes.arrayOf(
                React.PropTypes.shape({ label: React.PropTypes.string.isRequired })
            ).isRequired,
        // Default text value
        defaultValue: React.PropTypes.string,
        // Combobox id disabled
        disabled: React.PropTypes.bool,
        // Function for filter items in data (uses value from text field)
        filterFunc: React.PropTypes.oneOfType([
                        React.PropTypes.func,
                        React.PropTypes.oneOf([false])
                    ]),
        // Function which will be invoked when value is changed
        onChange: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            data: [],
            defaultValue: "",
            disabled: false,
            filterFunc: function(textValue, item){
                var s = textValue.toLowerCase().replace(' ', '');
                return item.label.toLowerCase().replace(' ', '').indexOf(s) >= 0;
            },
            onChange: function() {},
        };
    },

    getInitialState: function() {
        var _filtratedData = this.props.data;
        if (this.props.defaultValue !== '') {
            _filtratedData = this._getFiltratedData(this.props.defaultValue, this.props.data);
        }

        return {
            isOpen: false,
            isEnabled: !this.props.disabled,
            _data: this.props.data,
            _filtratedData: _filtratedData,
            _textValue: this.props.defaultValue,
            _selectedOptionData: null,
            _selectedIndex: -1,
            additionalClassName: ''
        };
    },

    render: function() {
        var cls = {};
        cls[CSS_PREFIX] = true;
        cls[clsBlockState('closed')] = !this.state.isOpen;
        cls[clsBlockState('disabled')] = !this.state.isEnabled;

        var dropdown = "";
        if (this.state.isEnabled) {
            dropdown = (
                React.createElement("div", {className: clsElem('dropdown')}, 
                    React.createElement("div", {className: clsElem('dropdownWrapper')}, 
                        React.createElement("ul", {className: clsElem('dropdownList')}, 
                            this.state._filtratedData.map(this._dataToOption)
                        )
                    )
                )
            );
        }
        return (
            React.createElement("div", {className: cx(cls) + ' ' + this.state.additionalClassName, 
                onKeyDown: this._handleKeyDown, 
                onBlur: this._blur}, 
                React.createElement("input", {
                    ref: "textField", 
                    type: "text", 
                    disabled: !this.state.isEnabled, 
                    className: clsElem('input'), 
                    value: this.state._textValue, 
                    onChange: this._handleTextChange, 
                    onFocus: this._focus}), 
                dropdown, 
                React.createElement("span", {className: clsElem('buttonWrapper')}, 
                    React.createElement("button", {
                        ref: "button", 
                        type: "button", 
                        onClick: this._handleButtonClick, 
                        className: clsElem('button'), 
                        disabled: !this.state.isEnabled}, "▼")
                )
            )
        );
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (prevState._textValue !== this.state._textValue) {
            this.props.onChange(this.state._textValue, prevState._textValue);
        }
    },

    // Custom component methods
    // Private
    _timerId: null,

    /**
     * Convert dataItem to <Option/>
     * @param  {object} dataItem
     * @param  {string} dataItem.label Label for option
     * @param  {number} idx index of element
     * @return {<Option/>}
     */
    _dataToOption: function(dataItem, idx) {
        var label = dataItem.label;
        var selected = (idx === this.state._selectedIndex);
        var item = (
            React.createElement(ComboboxOption, {
                selected: selected, 
                label: label, 
                value: dataItem, 
                key: 'key-' + label.toLowerCase().replace(' ', ''), 
                onClick: this._handleOptionClick}, 
                label
            )
        );
        return item;
    },

    /**
     * Handle textField change
     * @param  {event} evt
     * @return false
     */
    _handleTextChange: function(evt) {
        var newValue = evt.target.value;
        this.setState({
            _selectedIndex: -1,
            _selectedOptionData: null
        });
        this.setTextValue(newValue, true);
        return false;
    },

    /**
     * Handle <Option> click
     * @param  {event} evt
     * @param  {string} label <Option/> label
     * @param  {object} dataItem <Option/> dataItem
     * @return false
     */
    _handleOptionClick: function(evt, label, dataItem) {
        this.setState({_selectedOptionData: dataItem});
        this.setTextValue(label);
        return false;
    },

    /**
     * Handle textField keyDown
     * @param  {event} evt
     * @return {bool} false if is ArrowDown/ArrowUp/Enter/Escape keys
     */
    _handleKeyDown: function(evt) {
        var result = true;
        if (evt.key === 'ArrowDown') {
            this._moveOptionSelection(1);
            result = false;
        } else if (evt.key === 'ArrowUp') {
            this._moveOptionSelection(-1);
            result = false;
        } else if (evt.key === 'Enter') {
            var dataItem = this.state._filtratedData[this.state._selectedIndex];
            if (dataItem) {
                this._handleOptionClick(null, dataItem['label'], dataItem);
            }
            this.refs.textField.getDOMNode().blur();
            result = false;
        } else if (evt.key === 'Escape') {
            this.refs.textField.getDOMNode().blur();
            this.close();
            result = false;
        }
        return result;
    },

    /**
     * Handle button click
     * @param  {event} evt
     */
    _handleButtonClick: function(evt) {
        if (!this.state.isOpen) {
            this.refs.textField.getDOMNode().focus();
        }
        return false;
    },

    /**
     * Handle textField focus
     * @param  {event} evt
     */
    _focus: function(evt) {
        clearTimeout(this._timerId);
        delete this._timerId;

        var textField = evt.target;
        var newValue = textField.value;
        var len = newValue.length;
        textField.setSelectionRange(len, len);
        this.setTextValue(newValue, true);
        return false;
    },

    /**
     * Handle textField blur
     * @param  {event} evt
     */
    _blur: function(evt) {
        if (evt.relatedTarget == null || !this.getDOMNode().contains(evt.relatedTarget)) {
            // HINT if this.close() fires before this._handleOptionClick() nothing happens :(
            this._timerId = setTimeout(this.close, 100);
        }
        return false;
    },

    /**
     * move option selection
     * @param  {number} direction of selction move (positive - move down, negative - move up)
     */
    _moveOptionSelection: function(direction) {
        if (this.state.isOpen) {
            var _selectedIndex = this.state._selectedIndex + direction;
            if (_selectedIndex < 0) {
                _selectedIndex = this.state._filtratedData.length - 1;
            } else if (_selectedIndex >= this.state._filtratedData.length) {
                _selectedIndex = 0;
            }
            this.setState({_selectedIndex: _selectedIndex}, this._scrollToSelected);
        }
    },

    /**
     * Scroll dropdown to selected element
     */
    _scrollToSelected: function() {
        var cls = clsState(clsElem('dropdownOption'), 'selected');
        this.getDOMNode().getElementsByClassName(cls)[0].scrollIntoView(false);
    },

    /**
     * Filter state._data by text
     * @param  {string=this.state._textValue} txt
     * @param  {string=this.state._data} data
     * @return {object[]}   filtrated data
     */
    _getFiltratedData: function(txt, data){
        if (txt == null) {
            txt = this.state._textValue;
        }
        if (data == null) {
            data = this.state._data;
        }

        var filtratedData = data;

        if (typeof this.props.filterFunc === 'function') {
            var filterFunc = _partial(this.props.filterFunc, txt);
            filtratedData = data.filter(filterFunc);
        }

        return filtratedData;
    },

    // Public
    /**
     * Open Combo box dropdown list is not empty
     */
    open: function() {
        var isOpen = this.state._filtratedData.length > 0;
        this.setState({
            isOpen: isOpen,
            _selectedIndex: -1
        });
    },

    /**
     * Close Combo box dropdown
     */
    close: function() {
        this.setState({
            isOpen: false
        });
    },

    /**
     * Dropdown is closed
     * @return {Boolean}
     */
    isClosed: function() {
        return !this.state.isOpen;
    },

    /**
     * Enable Combo box
     */
    enable: function() {
        this.setState({
            isEnabled: true
        });
    },

    /**
     * Disable Combo box
     */
    disable: function() {
        this.setState({
            isEnabled: false,
            isOpen: false
        });
    },

    /**
     * Combobox is disabled
     * @return {Boolean}
     */
    isDisabled: function() {
        return !this.state.isEnabled;
    },

    /**
     * Set Combobox text value
     * @param {string} newValue
     * @param {bool} open if passable
     */
    setTextValue: function(newValue, open) {
        open = open || false;
        var newData = this._getFiltratedData(newValue);

        this.setState({
            _textValue: newValue,
            _filtratedData: newData,
            isOpen: open && (newData.length > 0)
        });
    },
    
    componentWillReceiveProps: function(nextProps) {
    	this.setData(nextProps.data);
	},

    /**
     * Set data items
     * @param {object[]} array of dataItems for <Option/>
     */
    setData: function(data) {
        var newFiltratedData = this._getFiltratedData(this.state._textValue, data);

        this.setState({
            _filtratedData: newFiltratedData,
            _data: data,
            _selectedIndex: -1,
            _selectedOptionData: null
        });
    },

    /**
     * Get value
     * @return {string|object} value
     */
    value: function() {
        var result = this.state._selectedOptionData || this.state._textValue;
        return result;
    }
});


},{"react":undefined,"react-addons":undefined}],3:[function(require,module,exports){
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
			"selectedExampleWords": {}
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
},{"./service/SpellingService.js":7,"./templates.js":8,"react":undefined}],4:[function(require,module,exports){
if (typeof(window) == 'undefined') {
	var React = require('react');
}
else {
	var React = window.React;
}

var templates = require('./templates.js');

module.exports = React.createClass({displayName: "exports",
	
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
		while (stateIndex < 5) {
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
},{"./templates.js":8,"react":undefined}],5:[function(require,module,exports){
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
},{"./templates.js":8,"react":undefined}],6:[function(require,module,exports){
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

},{"./templates.js":8,"react":undefined}],7:[function(require,module,exports){

var SpellingService = {
};

SpellingService.check = function(text, successHandler, errorHandler) {
	
	SpellingService.send({"text": text}, 'wordsearch/spellcheck.php', successHandler, errorHandler);
};

SpellingService.getExamples = function(searchType, searchTerm, successHandler, errorHandler) {
	
	SpellingService.send({"searchType": searchType, "searchTerm": searchTerm}, 'wordsearch/words.php', successHandler, errorHandler);
	
};

SpellingService.send = function(data, url, successHandler, errorHandler) {
	var params = JSON.stringify(data);
	var req = new XMLHttpRequest();
	req.open("POST", url, true);
	req.addEventListener("load", 
		function(data, status) {successHandler(JSON.parse(req.responseText), status)}, false);
	req.addEventListener("error", function(data, status) {errorHandler(status)}, false);
	req.setRequestHeader("Content-type", "application/json; charset=utf-8");
	req.setRequestHeader("Content-length", params.length);
	req.setRequestHeader("Connection", "close");
	req.send(params);
};

module.exports = SpellingService;

},{}],8:[function(require,module,exports){
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
							"Story Text"
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
				React.createElement("button", null, "Analyse text")
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
				React.createElement(CorrectionEntry, {ref: "correction4", correction: this.state.corrections[4]})
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
					React.createElement(Combobox, {ref: "suggestionsCombo", data: this.state.spellingSuggestions})
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



},{"./Combobox.js":2,"./CorrectionEntry.js":3,"./CorrectionList.js":4,"./ResultsList.js":5,"./StoryWriter.js":6,"react":undefined}]},{},[1]);

//# sourceMappingURL=../script/bundle.js.map