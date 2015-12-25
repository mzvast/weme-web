var Box = React.createClass({
	displayName: 'Box',

	render: function () {
		return React.createElement(
			'h1',
			null,
			'HelloReact'
		);
	}
});

ReactDOM.render(React.createElement(Box, null), document.getElementById('box'));