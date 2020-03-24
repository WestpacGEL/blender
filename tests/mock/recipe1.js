/** @jsx jsx */

function Alert({ look, headline, headingTag, children }) {
	return (
		<div css={{
			color: 'red',
		}}>{children}</div>
	);
}

function Recipe() {
	return (
		<div>
			<Alert>Text</Alert>
			<Alert look="info">Text</Alert>
			<Alert look="warning">Text</Alert>
			<Alert look="danger">Text</Alert>
			<Alert look="system">Text</Alert>
			<Alert look="system" headline="Text">
				Text
			</Alert>
			<Alert look="system" headline="Text" headingTag="h3">
				Text
			</Alert>
		</div>
	);
}

export default Recipe;
