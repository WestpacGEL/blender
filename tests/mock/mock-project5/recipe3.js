/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { Core } from './Core';
import { Component1 } from './Component1';

export function AllStyles({ brand }) {
	return (
		<Core brand={{
			COLORS: {
				color1: 'blue',
				color2: 'white',
				color3: 'red',
			}
		}}>
			<Component1>hello</Component1>
		</Core>
	);
}

export function Docs({ brand }) {
	return [
		{
			heading: 'Variation 1 for Component 1',
			component: () => (
				<Core>
					<Component1/>
				</Core>
			),
		},
	];
}
