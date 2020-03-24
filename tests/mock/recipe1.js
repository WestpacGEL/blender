/** @jsx jsx */

import { jsx } from '@emotion/core';

function Alert({ look = '', children }) {
	return (
		<div
			css={{
				label: `alert-${look}`,
				background: look,
			}}
		>
			{children}
		</div>
	);
}

function Recipe() {
	return (
		<div>
			<Alert>Text</Alert>
			<Alert look="red">Text</Alert>
			<Alert look="blue">Text</Alert>
			<Alert look="green">Text</Alert>
			<Alert look="gray">Text</Alert>
		</div>
	);
}

export default Recipe;
