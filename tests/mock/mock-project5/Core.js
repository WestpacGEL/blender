/** @jsx jsx */

import { Fragment, useState, createContext, useContext } from 'react';
import { jsx, CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';

export const BrandContext = createContext();

export const useBrand = () => {
	const brandObject = useContext(BrandContext);
	const errorMessage = `You need to wrap all your components in the <Core/> component.`;

	if (!brandObject) {
		throw new Error(errorMessage);
	}

	return brandObject;
};

const label = 'Core'; // for use in stylis plugin and the css label

const AddRootClass = ({ children }) => {
	let [cache] = useState(() => {
		return createCache({
			stylisPlugins: [
				(context, content, selectors, parent, line, column, length) => {
					if (
						context === -2 &&
						selectors.length &&
						selectors[0] !== '' && // exclude <Global /> styles
						!selectors[0].includes(`-${label}`) // exclude nested <GEL /> (Core) styles
					) {
						/**
						 * Add to beginning of `content` string, if not beginning with `@`
						 * (catches `@media` and `@font-face` queries etc)
						 *
						 * Regex explanation:
						 * - ^ Beginning of string
						 * - [^@] Negated set (not `@` symbol)
						 * - .* Any character except new line, match 0 or more
						 * - /g Global search
						 */
						content = content.replace(/^[^@].*/g, (s) => `.GEL ${s}`);

						/**
						 * Additionally, insert within @media queries
						 *
						 * Regex explanation:
						 * - (\){) Match `){`
						 * - /g Global search
						 */
						content = content.replace(/(\){)/g, (s) => `${s}.GEL `);
					}
					return content;
				},
			],
		});
	});
	return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export function Core({ brand, children }) {
	return (
		<BrandContext.Provider value={brand}>
			<section
				className="GEL"
				css={{
					label,
					background: 'rebeccapurple',
					':after': {
						content: '"THIS IS CORE!!!!"',
					},
				}}
			>
				<AddRootClass>{children}</AddRootClass>
			</section>
		</BrandContext.Provider>
	);
}
