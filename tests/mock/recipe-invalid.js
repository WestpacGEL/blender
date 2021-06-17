/** @jsx jsx */

import { jsx } from '@emotion/react';
import { Fragment } from 'react';

export function AllStyles({ brand }) {
	return (
		<Fragment>
			<Component look="look1" />
			<Component look="look2" />
			<Component look="look3" />
		</Fragment>
	);
}

export function Docs({ brand }) {
	return [
		{
			heading: 'Variation 1 for Component 1',
			component: () => (
				<Fragment>
					<Component>Here comes the content</Component>
				</Fragment>
			),
		},
		{
			heading: 'Variation 2 for Component 1',
			component: () => (
				<Fragment>
					<Component look="look2">Here comes the content</Component>
				</Fragment>
			),
		},
		{
			heading: 'Variation 3 for Component 1',
			component: () => (
				<Fragment>
					<Component look="look3">Here comes the content</Component>
				</Fragment>
			),
		},
	];
}
