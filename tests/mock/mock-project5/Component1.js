/** @jsx jsx */

import { useBrand } from './Core';
import { jsx } from '@emotion/core';

export function Component1({ look = 'look1', children }) {
	const { COLORS } = useBrand();

	const styleMap = {
		look1: COLORS.color1,
		look2: COLORS.color2,
		look3: COLORS.color3,
	};

	return (
		<div
			css={{
				label: `component1-${look}`,
				background: styleMap[look],
			}}
		>
			{children}
		</div>
	);
}
