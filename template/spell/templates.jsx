var templates = templates || {};

templates.App = function() {

	return (
		<span>
			<div className="column column-1-3">
				<article>
					<div>
						<header>
							Story Text
						</header>
						<spell.StoryWriter submitStory={this.submitStory}/>
						<div className="clear"></div>
					</div>
				</article>
			</div>
	
			<div className="column column-2-3">
				<article>
					<div>
						<div className="word-column">
							<spell.CorrectionList corrections={this.state.corrections}/>
						</div>
						<div className="clear"></div>
					</div>
				</article>
			</div>
		</span>
	)
	
};


templates.StoryWriter = function() {
	return (
		<div>
			<form onSubmit={this.handleSubmit} className="large">
				<textarea 
					ref="storyText"
					autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
					placeholder=""
				></textarea>
				<button>Analyse text</button>
			</form>
		</div>
	);
};


templates.CorrectionList = function() {
	
	return (
		<div>
			<table className="correctionsTable" cellSpacing="0" >
				<thead>
					<tr>
						<th>Student Attempt</th>
						<th>Word Confirmed</th>
						<th>Word Search</th>
					</tr>
				</thead>
				<spell.CorrectionEntry ref="correction0" correction={this.state.corrections[0]}/>
				<spell.CorrectionEntry ref="correction1" correction={this.state.corrections[1]}/>
				<spell.CorrectionEntry ref="correction2" correction={this.state.corrections[2]}/>
				<spell.CorrectionEntry ref="correction3" correction={this.state.corrections[3]}/>
				<spell.CorrectionEntry ref="correction4" correction={this.state.corrections[4]}/>
			</table>
			<div className="clear"></div>
			<div className="centering">
				<button className="large"
					onClick={this.showResults}>Print list</button>
			</div>
			<spell.ResultsList ref="resultsList" visible={this.state.resultsVisible} results={this.state.correctionResults}/>
		</div>
	);
};

templates.ResultsList = function() {
	
	if (this.state.visible) {
		
		var i, words, wordEntry, rows = [];
		for (i=0; i<this.state.results.length; i++) {
			wordEntry = this.state.results[i];
			words = [];
			for (word in wordEntry.examples) {
				words.push(<div>{word}</div>);
			}
			
			rows.push(
				<tr>
					<td>
						<div>
							{words}
						</div>
					</td>
				</tr>);
		}
		
		return (
			<div ref="parentElement" className="results-display" onClick={this.hideResults}>
				<table>
					<thead>
						<tr>
							<th>Word List</th>	
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
	
			</div>
		);
	}
	else {
		return (<div></div>)
	}
};

templates.CorrectionEntry = function() {
	
	var classes = {listState: (this.state.resultsVisible ? "" : "hidden")};
	var word;
	var resultsList = [];
	
	this.state.resultsList.forEach(function(word) {
		resultsList.push(<div key={"rl" + word} onClick={function(){this.selectExampleWord(word)}.bind(this)}>{word}<div className="add-word-button"></div></div>);
	}.bind(this));
	
	selectedExampleWords = [];
	Object.keys(this.state.selectedExampleWords).forEach(function(word) {
		selectedExampleWords.push(<div key={"ew" + word} onClick={function(){this.removeExampleWord(word)}.bind(this)}>{word}</div>);
	}.bind(this));
	
	return (
		<tbody>
			<tr className="input-fields-row">
				<td>
					<input className="disabled" value={this.state.word} onChange={this.changeWord} onBlur={this.updateSuggestions} disabled="true"/>
				</td>
				<td>
					<NS.Combobox ref="suggestionsCombo" data={this.state.spellingSuggestions} />
				</td>
				<td>
					<div className="example-search-container">
						<select onChange={this.changeSearchType} value={this.state.searchType}>
							<option value="contains">Contains..</option>
							<option value="startsWith">Starts with..</option>
							<option value="endsWith">Ends with..</option>
						</select>
						<input className="example-search" placeholder="eg: ing" value={this.state.searchText} onChange={this.changeSearchText} onKeyUp={this.keyUpHander}/>
						<button ref="toggleResultsButton" className="small results-search" onClick={this.toggleResultsVisible}></button>
						<div className={classes.listState + ' ' + 'positioner'}>
							<div ref="dropdownList" className="dropdown-list">
								{resultsList}
							</div>
						</div>
					</div>
				</td>
			</tr>
			<tr className="example-words-row">
				<td colSpan="3">
					<h2 className="exampleWordsTitle">Word List:</h2>
					{selectedExampleWords}
				</td>
			</tr>
		</tbody>
	);
};
