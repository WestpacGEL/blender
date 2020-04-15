/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Fragment } from 'react';

function Component({ children }) {
	return (
		<div
			css={{
				background: 'red',
			}}
		>
			{children}
		</div>
	);
}

export function AllStyles({ children }) {
	return <Component>{children}</Component>;
}

export function Docs({ brand }) {
	return [
		{
			heading: 'Variation 1 for Component',
			component: () => (
				<Fragment>
					<Component>Here comes the content</Component>
				</Fragment>
			),
		},
	];
}
