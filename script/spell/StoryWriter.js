namespace("spell");

spell.StoryWriter = React.createClass({
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
