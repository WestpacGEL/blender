# Blender [![CircleCI](https://circleci.com/gh/WestpacGEL/blender/tree/master.svg?style=svg)](https://circleci.com/gh/WestpacGEL/blender/tree/master)

> The blender generates human readable css class names and html from react components which support the Blender.

## Content

- [What the blender does](#what-the-blender-does)
- [CLI](#cli)
- [API](#api)
- [How to add blender support](#how-to-add-blender-support)
- [Development](#development)

## What the blender does

The blender takes a react/emotion component and renders out human readable HTML and CSS.

A typical render for a react component with emotion would be:

HTML:

```html
<div class="css-1v0bpgp">
	<span class="css-56rr0o"> My text </span>
</div>
```

This is very hard to manage for the consumer when you add modifiers for your component:

```html
<div class="css-1v0bpgp">
	<span class="css-56rr0o"> Primary </span>

	<span class="css-eh2j24"> Hero </span>
</div>
```

The blender takes the above output and creates human readable classes that make it easier to manage modifiers.

```html
<div class="GEL-core-v1_0_0">
	<span class="GEL-badge-v1_0_0 GEL-badge-v1_0_0-primary"> Primary </span>

	<span class="GEL-badge-v1_0_0 GEL-badge-v1_0_0-hero"> Hero </span>
</div>
```

### Tester

The tester checks labels created by emotion for any hashes that can't be removed.
This is useful when you implement blender support in a component and want to make sure everything is covered.

If the tester finds ids (css classes) have the same label but a different hash we can't remove the hashes safely and make the classes readable. See below example.

```
[
	"1jr47et",       // ignored cause it doesn't exists in css output
	"vctdvy-alert",
	"epbyb1-thing",  // found bug
	"7qw58u-foo",
	"x1b3bk-thing",  // because these two have same label but different hash
	"1sa041k-bar",
],
```

The tester also runs the whole recipe of a component to make sure there are no render issues.

## CLI

You can run the blender as a cli tool.
First install it via npm:

```sh
npm i -g @westpac/blender
```

Then you can run the `blender` command.

```sh
cd path/to/my/project
blender
```

The blender comes with the following settings:

```sh
blender
	-T                                    # --test
	-b WBC                                # --brand
	-o path/to                            # --output
	-c path/to/css                        # --output-css
	-j path/to/js                         # --output-js
	-d path/to/docs                       # --output-docs
	-t path/to/token                      # --output-token
	-f less                               # --tokens-format
	-S "@westpac"                         # --scope
	-i "@westpac/button" "@westpac/alert" # --include
	-x "@westpac/button" "@westpac/alert" # --exclude
	-D path/to/cwd                        # --cwd
	-p                                    # --prettify
	-J                                    # --include-jquery
	-m                                    # --modules
	-C                                    # --version-in-class
	-g                                    # --debug
	-v                                    # --version
	-h                                    # --help
```

An example of running the blender with all flags would be:

```sh
blender -Tb WBC --output path/to/all --output-css path/to/css --output-js path/to/js --output-docs path/to/docs --output-token path/to/token --scope "@westpac" --include "@westpac/button" "@westpac/core" --exclude "@westpac/tabcordion" -pJmCf less -gvh
```

_(💡 Note that you can combine boolean flags together: `blender -pmj` is the same as `blender -p -m -j`)_

Common use cases:

```sh
blender -b WBC -o path/to/all                # get all files in the blender folder
blender -b WBC -c path/to/css -j path/to/js  # get css and js only
```

Cases where flags are ignored or missing:

```sh
blender -o path/to/out                         # error as no brand specified
blender -b WBC -o path/to/out -j path/to/js    # get only js, -o is ignored
```

## API

Running the blender programmatically is possible via node:

```js
const blender = require('@westopac/blender');

const result = await blender({
	cwd: 'path/to/cwd',
	test: false,
	scope: '@westpac',
	output: 'path/to/all',
	outputCss: 'path/to/css',
	outputJs: 'path/to/js',
	outputDocs: 'path/to/docs',
	outputToken: 'path/to/token',
	outputZip: true,
	tokensFormat: 'less',
	include: ['@westpac/button', '@westpac/core'],
	exclude: ['@westpac/tabcordion'],
	prettify: true,
	modules: true,
	brand: 'WBC',
	includeJquery: true,
	versionInClass: true,
});
```

## How to add blender support

The blender can generate human readable html and css from react and emotion components.
For this to work we require `label` attributes in our `css` prop and a couple files to blend and the `blender` key inside your `package.json`.

### `getLabel`

We have to add labels for every variations for props.
To archive this we have the [`getLabel`](https://github.com/WestpacGEL/GEL/blob/master/components/core/src/getLabel.js) function that you can import from `@westpac/core`.
Make sure you only add variations that will change CSS.
Adding more means more css classes and more html.
The best way to do this I found was to add the labels to the overrides files:

- look at the `[something]Styles` function inside the overrides
- copy all props from there that are being constructed
- go to the css props and insert `getLabel` with an appropriate prefix

```jsx
/** @jsx jsx */
import { jsx, getLabel } from '@westpac/core';

const Component = ({ state, ...rest }) => <div {...rest} />;

const componentStyles = (_, { dismissible, look }) => {
	//     There are two props here ----^

	const styleMap = {}; // more code here
	return {
		// The `Component-prefix` is also important to name what (sub)component this is
		label: getLabel('Component-prefix', { dismissible, look }),
		//                          ----^
		// So we add those two into the getLabel function
		padding: dismissible ? '1.125rem 1.875rem 1.125rem 1.125rem' : '1.125rem',
		// you can see here --^ how the prop changes css dynamically
		transition: 'opacity 300ms ease-in-out',
		opacity: 1,
		borderTop: '1px solid',
		borderBottom: '1px solid',
		...styleMap[look].css,
		// here too we change css dynamically with props
	};
};

const componentAttributes = () => null;

export const defaultComponent = {
	component: Component,
	styles: componentStyles,
	attributes: componentAttributes,
};
```

For the prefixes try to name so it's visible what is a parent of what.

So `getLabel('Component')` on the root component and `getLabel('Component-subcomponent')` on the sub-component will become:

```html
<div class="GEL-Component-v1_0_0-props">
	<div class="GEL-Component-v1_0_0-subcomponent-props">Your sub-component</div>
</div>
```

### Js fallback

Since the blender just SSR each component it won't provide the functionality of react and any interactivity.
For this you have to provide a `js` file for fallback.
In the GEL3 we use jQuery for this.
Each jQuery file should target elements via the `data-js` attribute since classes can vary depending on your blend settings.
So things like `data-js="body__version__"` or `data-js="component-closeBtn__version__"` should work well and you target this via `$('[data-js="component-closeBtn__version__"]')` in jQuery.

The `__version__` bit is important for the blender to know where to inject the version.

### Nested Classes/Custom Component Classes

In order to support nested classes within css or custom classNames on a component you have to add the `__convert__` prefix. This allows the blender to also convert and format these classes into the blender format.

```html
<div className="__convert__subComponent">your sub-component</div>
```

```jsx
const style = {
	label: subComponent,
	color: '#d5002b',

	'.__convert__subComponent-nested': {
		color: '#621a4b',
	},
};
```

### Core components

Inside the `package.json`

```json
"blender": {
	"recipe": "path/to/recipe.js",
	"js": "path/to/jquery-lib.js",
	"isCore": true
}
```

The `js` file should contain any framework other component rely on.
In our case that's jQuery.

The `recipe` file must export two named components `AllStyles` and `Docs`:

```jsx
import React from 'react';
import { Component } from '../src/index.js';

export function AllStyles({ brand, children }) {
	return <Component brand={brand}>{children}</Component>;
}

export function Docs({ brand }) {
	return [
		{
			heading: 'The Core Component',
			component: () => (
				<Component brand={brand}>Add your GEL components inside the Core component</Component>
			),
		},
	];
}
```

Both of these function get the `brand` object passed in and only in core `AllStyles` also gets `children` so we can remove core from the other components later.
The `Docs` component returns an array with a `heading` and a `component` key.

In short:

- The `AllStyles` component should contain all possible variations for a component
- The `Docs` component should contain everything we want to show in the documentation.

### Other components

Inside the `package.json`

```json
"blender": {
	"recipe": "blender/recipe.js",
	"js": "blender/script.js"
}
```

The `js` file is optional and only required if you have js functionality.

The `recipe` file must export two named components `AllStyles` and `Docs`:

```jsx
import { GEL } from '@westpac/core';
import React from 'react';

import { Component } from '@westpac/alert';

export function AllStyles({ brand }) {
	return (
		<GEL brand={brand}>
			<Component look="success" />
			<Component look="info" />
			<Component look="warning" />
			<Component heading="Your alert heading" />
			<Component dismissible />
		</GEL>
	);
}

export function Docs({ brand }) {
	return [
		{
			heading: 'A success alert',
			component: () => (
				<GEL brand={brand}>
					<Component look="success">Your alert body</Component>
				</GEL>
			),
		},
		{
			heading: 'A info alert',
			component: () => (
				<GEL brand={brand}>
					<Component look="info">Your alert body</Component>
				</GEL>
			),
		},
		{
			heading: 'A warning alert',
			component: () => (
				<GEL brand={brand}>
					<Component look="warning">Your alert body</Component>
				</GEL>
			),
		},
	];
}
```

Same as the core component.

## Development

<details>
<summary>👉 All npm scripts</summary>

| name                | description                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `build`             | Building the source files and moving them into `lib/` and `bin/` folder                                              |
| `build:lib`         | Building all lib files. Changing these files won't break symlinks created with `npm link`                            |
| `build:bin`         | Moving the `bin.js` file from `lib/` to `bin/` and renaming it to `index.js`                                         |
| `watch`             | Watching all files inside `src/` for changes and running `build:lib` if detected                                     |
| `format`            | Format all code with prettier                                                                                        |
| `test`              | Run all tests                                                                                                        |
| `test:format`       | Testing for code style differences                                                                                   |
| `test:unit`         | Run all unit Jest tests                                                                                              |
| `test:unit-watch`   | Run Jest in watch mode                                                                                               |
| `test:types`        | Run all type tests                                                                                                   |
| `types:clean`       | Cleans all type definition files generated by `types:declaration`                                                    |
| `types:declaration` | Build type declaration files                                                                                         |
| `nuke`              | Remove all artifacts from including `node_modules` folder and lock files                                             |
| `fresh`             | Run `nuke` and `yarn` in sequence                                                                                    |
| `deploy:staging`    | Deploy the blender to staging environment, this will sync up all files, install dependencies and restart the service |
| `deploy:live`       | Deploy the blender to live environment, this will sync up all files, install dependencies and restart the service    |

</details>

Please use [yarn](https://yarnpkg.com/) to install the dependencies for this project.

```sh
cd path/to/repo/root
yarn
```

Once everything is installed you can symlink the blender binary into your PATH by running:

```sh
npm link
```

This will allow you to use the `blender` command while developing the app.

To see changes you make to the `src/` folder, run:

```
yarn watch
```

### Tests

We use [Jest](https://jestjs.io/) for unit testing and have setup a bunch of mock folders and projects inside `tests/`.
Run all tests via:

```
yarn test
```
