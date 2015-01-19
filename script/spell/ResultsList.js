namespace("spell");

spell.ResultsList = React.createClass({
	
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
	}
});