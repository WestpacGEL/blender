/**
 * A small script to automatically generate a bunch of mock packages
 **/
const path = require('path');
const fs = require('fs');

const { createDir } = require('../../lib/files.js');
const { color } = require('../../lib/color.js');

// STANDARD TEMPLATE
const templateStd = {
	blender1: ({ num, dir }) => {
		const content = `$(function() {
	console.log('JQuery entry file for Component${num}');
});
`;
		const filePath = path.normalize(`${dir}/component${num}/blender/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}jquery.js`, content, { encoding: 'utf8' });
	},
	blender2: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `import React, { Fragment } from 'react';
import { Core } from '${core}core';

import { Component${num} } from '${scope}component${num}';

export function AllStyles({ brand }) {
	return (
		<Core brand={brand}>
			<Component${num} look='look1'/>
			<Component${num} look='look2'/>
			<Component${num} look='look3'/>
		</Core>
	);
}

export function Docs({ brand }) {
	return (
		<Core brand={brand}>
			<h2>Component ${num}</h2>

			<Component${num} look='red'/>
		</Core>
	);
}
`;
		const filePath = path.normalize(`${dir}/component${num}/blender/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}recipe.js`, content, { encoding: 'utf8' });
	},
	dist1: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('${core}core');
var core$1 = require('@emotion/core');

/** @jsx jsx */
function Component${num}(_ref) {
  var _ref$look = _ref.look,
      look = _ref$look === void 0 ? 'look1' : _ref$look,
      children = _ref.children;

  var _useBrand = core.useBrand(),
      COLORS = _useBrand.COLORS;

  var styleMap = {
    look1: COLORS.color1,
    look2: COLORS.color2,
    look3: COLORS.color3
  };
  return core$1.jsx("div", {
    css: {
      label: "component${num}-".concat(look),
      background: styleMap[look]
    }
  }, children);
}

exports.Component${num} = Component${num};
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.dev.js`, content, { encoding: 'utf8' });
	},
	dist2: ({ num, dir }) => {
		const content = `'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./component${num}.cjs.prod.js");
} else {
  module.exports = require("./component${num}.cjs.dev.js");
}
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.js`, content, { encoding: 'utf8' });
	},
	dist3: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var core = require("${core}core"), core$1 = require("@emotion/core");

function Component${num}(_ref) {
  var _ref$look = _ref.look, look = void 0 === _ref$look ? "look1" : _ref$look, children = _ref.children, COLORS = core.useBrand().COLORS, styleMap = {
    look1: COLORS.color1,
    look2: COLORS.color2,
    look3: COLORS.color3
  };
  return core$1.jsx("div", {
    css: {
      label: "component${num}-".concat(look),
      background: styleMap[look]
    }
  }, children);
}

exports.Component${num} = Component${num};
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.prod.js`, content, { encoding: 'utf8' });
	},
	dist4: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `import { useBrand } from '${core}core';
import { jsx } from '@emotion/core';

/** @jsx jsx */
function Component${num}(_ref) {
  var _ref$look = _ref.look,
      look = _ref$look === void 0 ? 'look1' : _ref$look,
      children = _ref.children;

  var _useBrand = useBrand(),
      COLORS = _useBrand.COLORS;

  var styleMap = {
    look1: COLORS.color1,
    look2: COLORS.color2,
    look3: COLORS.color3
  };
  return jsx("div", {
    css: {
      label: "component${num}-".concat(look),
      background: styleMap[look]
    }
  }, children);
}

export { Component${num} };
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.esm.js`, content, { encoding: 'utf8' });
	},
	src1: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `/** @jsx jsx */

import { useBrand } from '${core}core';
import { jsx } from '@emotion/core';

export function Component${num}({ look = 'look1', children }) {
	const { COLORS } = useBrand();

	const styleMap = {
		look1: COLORS.color1,
		look2: COLORS.color2,
		look3: COLORS.color3,
	};

	return (
		<div
			css={{
				label: \`component${num}-$\{look}\`,
				background: styleMap[look],
			}}
		>
			{children}
		</div>
	);
}
`;
		const filePath = path.normalize(`${dir}/component${num}/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}Component${num}.js`, content, { encoding: 'utf8' });
	},
	src2: ({ num, dir }) => {
		const content = `export { Component${num} } from './Component${num}';
`;
		const filePath = path.normalize(`${dir}/component${num}/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}index.js`, content, { encoding: 'utf8' });
	},
	pkg: ({ num, dir, scope = '@westpac/', jquery = true, core = '@westpac/' }) => {
		const content = `{
	"name": "${scope}component${num}",
	"version": "1.${num}.0",
	"description": "A standard component ${scope === '' ? 'out of scope ' : ''}${
			jquery ? '' : 'not '
		}supporting jquery",
	"blender": {
		"recipe": "blender/recipe.js"${
			jquery
				? `,
		"jquery": "blender/jquery.js"`
				: ''
		}
	},
	"dependencies": {
		"@emotion/core": "^10.0.28",
		"${core}core": "^1.0.0"
	},
	"peerDependencies": {
		"react": "^16.11.0"
	},
	"main": "dist/component${num}.cjs.js",
	"module": "dist/component${num}.esm.js",
	"files": [
		"blender/*.js",
		"dist/"
	],
	"devDependencies": {
		"react": "^16.13.0"
	}
}
`;
		const filePath = path.normalize(`${dir}/component${num}/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}package.json`, content, { encoding: 'utf8' });
	},
};

// NON BLENDER TEMPLATE
const templateNonBlender = {
	dist1: ({ num, dir }) => {
		const content = `'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@emotion/core');

/** @jsx jsx */
function Component${num}(_ref) {
  var children = _ref.children;
  return core.jsx("div", {
    css: {
      background: 'rebeccapurple'
    }
  }, children);
}

exports.Component${num} = Component${num};
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.dev.js`, content, { encoding: 'utf8' });
	},
	dist2: templateStd.dist2,
	dist3: ({ num, dir }) => {
		const content = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var core = require("@emotion/core");

function Component${num}(_ref) {
  var children = _ref.children;
  return core.jsx("div", {
    css: {
      background: "rebeccapurple"
    }
  }, children);
}

exports.Component${num} = Component${num};
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.prod.js`, content, { encoding: 'utf8' });
	},
	dist4: ({ num, dir }) => {
		const content = `import { jsx } from '@emotion/core';

/** @jsx jsx */
function Component${num}(_ref) {
  var children = _ref.children;
  return jsx("div", {
    css: {
      background: 'rebeccapurple'
    }
  }, children);
}

export { Component${num} };
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.esm.js`, content, { encoding: 'utf8' });
	},
	src1: ({ num, dir }) => {
		const content = `/** @jsx jsx */

import { jsx } from '@emotion/core';

export function Component${num}({ children }) {
	return (
		<div
			css={{
				background: 'rebeccapurple',
			}}
		>
			{children}
		</div>
	);
}
`;
		const filePath = path.normalize(`${dir}/component${num}/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}Component${num}.js`, content, { encoding: 'utf8' });
	},
	src2: templateStd.dist2,
	pkg: ({ num, dir, scope = '@westpac/' }) => {
		const content = `{
	"name": "${scope}component${num}",
	"version": "1.${num}.2",
	"description": "A standard component not supporting the blender",
	"dependencies": {
		"@emotion/core": "^10.0.28"
	},
	"peerDependencies": {
		"react": "^16.11.0"
	},
	"main": "dist/component${num}.cjs.js",
	"module": "dist/component${num}.esm.js",
	"devDependencies": {
		"react": "^16.13.0"
	}
}
`;
		const filePath = path.normalize(`${dir}/component${num}/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}package.json`, content, { encoding: 'utf8' });
	},
};

// INVALID TEMPLATE
const templateInvalid = {
	blender1: templateStd.blender1,
	blender2: templateStd.blender2,
	dist1: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('${core}core');
var core$1 = require('@emotion/core');

/** @jsx jsx */
function Component${num}(_ref) {
  var _ref$look = _ref.look,
      look = _ref$look === void 0 ? 'look1' : _ref$look,
      children = _ref.children;

  var _useBrand = core.useBrand(),
      COLORS = _useBrand.COLORS;

  var styleMap = {
    look1: COLORS.color1,
    look2: COLORS.color2,
    look3: COLORS.color3
  };
  return core$1.jsx("div", {
    css: {
      label: "alert",
      // not all style mutations are labeled
      background: styleMap[look]
    }
  }, children);
}

exports.Component${num} = Component${num};
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.dev.js`, content, { encoding: 'utf8' });
	},
	dist2: templateStd.dist2,
	dist3: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var core = require("${core}core"), core$1 = require("@emotion/core");

function Component${num}(_ref) {
  var _ref$look = _ref.look, look = void 0 === _ref$look ? "look1" : _ref$look, children = _ref.children, COLORS = core.useBrand().COLORS, styleMap = {
    look1: COLORS.color1,
    look2: COLORS.color2,
    look3: COLORS.color3
  };
  return core$1.jsx("div", {
    css: {
      label: "alert",
      background: styleMap[look]
    }
  }, children);
}

exports.Component${num} = Component${num};
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.cjs.prod.js`, content, { encoding: 'utf8' });
	},
	dist4: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `import { useBrand } from '${core}core';
import { jsx } from '@emotion/core';

/** @jsx jsx */
function Component${num}(_ref) {
  var _ref$look = _ref.look,
      look = _ref$look === void 0 ? 'look1' : _ref$look,
      children = _ref.children;

  var _useBrand = useBrand(),
      COLORS = _useBrand.COLORS;

  var styleMap = {
    look1: COLORS.color1,
    look2: COLORS.color2,
    look3: COLORS.color3
  };
  return jsx("div", {
    css: {
      label: "alert",
      // not all style mutations are labeled
      background: styleMap[look]
    }
  }, children);
}

export { Component${num} };
`;
		const filePath = path.normalize(`${dir}/component${num}/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}component${num}.esm.js`, content, { encoding: 'utf8' });
	},
	src1: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `/** @jsx jsx */

import { useBrand } from '${core}core';
import { jsx } from '@emotion/core';

export function Component${num}({ look = 'look1', children }) {
	const { COLORS } = useBrand();

	const styleMap = {
		look1: COLORS.color1,
		look2: COLORS.color2,
		look3: COLORS.color3,
	};

	return (
		<div
			css={{
				label: \`alert\`, // not all style mutations are labeled
				background: styleMap[look],
			}}
		>
			{children}
		</div>
	);
}
`;
		const filePath = path.normalize(`${dir}/component${num}/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}Component${num}.js`, content, { encoding: 'utf8' });
	},
	src2: templateStd.dist2,
	pkg: ({ num, dir, scope = '@westpac/', core = '@westpac/' }) => {
		const content = `{
	"name": "${scope}component${num}",
	"version": "1.${num}.3",
	"description": "A standard component with failing label",
	"blender": {
		"recipe": "blender/recipe.js",
		"jquery": "blender/jquery.js"
	},
	"dependencies": {
		"@emotion/core": "^10.0.28",
		"${core}core": "^1.0.0"
	},
	"peerDependencies": {
		"react": "^16.11.0"
	},
	"main": "dist/component${num}.cjs.js",
	"module": "dist/component${num}.esm.js",
	"files": [
		"blender/*.js",
		"dist/"
	],
	"devDependencies": {
		"react": "^16.13.0"
	}
}
`;
		const filePath = path.normalize(`${dir}/component${num}/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}package.json`, content, { encoding: 'utf8' });
	},
};

// CORE TEMPLATE
const templateCore = {
	blender1: ({ dir }) => {
		const content = `console.log('JQuery library from core');
`;
		const filePath = path.normalize(`${dir}/core/blender/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}jquery.js`, content, { encoding: 'utf8' });
	},
	blender2: ({ dir }) => {
		const content = `import React, { Fragment } from 'react';

import { Core } from '../src/index.js';

export function AllStyles({ brand }) {
	return (
		<Core brand={brand}/>
	);
}

export function Docs({ brand }) {
	return (
		<Core brand={brand}>
			<h2>Core</h2>

			<Core brand={brand}>
				Here goes your app
			</Core>
		</Core>
	);
}
`;
		const filePath = path.normalize(`${dir}/core/blender/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}recipe.js`, content, { encoding: 'utf8' });
	},
	dist1: ({ dir }) => {
		const content = `'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@emotion/core');
var react = require('react');

/** @jsx jsx */
var BrandContext = react.createContext();
var useBrand = function useBrand() {
  var brandObject = react.useContext(BrandContext);
  var errorMessage = "You need to wrap all your components in the <Core/> component.";

  if (!brandObject) {
    throw new Error(errorMessage);
  }

  return brandObject;
};
function Core(_ref) {
  var brand = _ref.brand,
      children = _ref.children;
  return core.jsx(BrandContext.Provider, {
    value: brand
  }, core.jsx("div", {
    css: {
      label: "core",
      background: 'rebeccapurple',
      ':after': {
        content: '"THIS IS CORE!!!!"'
      }
    }
  }, children));
}

exports.Core = Core;
exports.useBrand = useBrand;
`;
		const filePath = path.normalize(`${dir}/core/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}core.cjs.dev.js`, content, { encoding: 'utf8' });
	},
	dist2: ({ dir }) => {
		const content = `'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./core.cjs.prod.js");
} else {
  module.exports = require("./core.cjs.dev.js");
}
`;
		const filePath = path.normalize(`${dir}/core/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}core.cjs.js`, content, { encoding: 'utf8' });
	},
	dist3: ({ dir }) => {
		const content = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var core = require("@emotion/core"), react = require("react"), BrandContext = react.createContext(), useBrand = function() {
  var brandObject = react.useContext(BrandContext);
  if (!brandObject) throw new Error("You need to wrap all your components in the <Core/> component.");
  return brandObject;
};

function Core(_ref) {
  var brand = _ref.brand, children = _ref.children;
  return core.jsx(BrandContext.Provider, {
    value: brand
  }, core.jsx("div", {
    css: {
      label: "core",
      background: "rebeccapurple",
      ":after": {
        content: '"THIS IS CORE!!!!"'
      }
    }
  }, children));
}

exports.Core = Core, exports.useBrand = useBrand;
`;
		const filePath = path.normalize(`${dir}/core/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}core.cjs.prod.js`, content, { encoding: 'utf8' });
	},
	dist4: ({ dir }) => {
		const content = `import { jsx } from '@emotion/core';
import { createContext, useContext } from 'react';

/** @jsx jsx */
var BrandContext = createContext();
var useBrand = function useBrand() {
  var brandObject = useContext(BrandContext);
  var errorMessage = "You need to wrap all your components in the <Core/> component.";

  if (!brandObject) {
    throw new Error(errorMessage);
  }

  return brandObject;
};
function Core(_ref) {
  var brand = _ref.brand,
      children = _ref.children;
  return jsx(BrandContext.Provider, {
    value: brand
  }, jsx("div", {
    css: {
      label: "core",
      background: 'rebeccapurple',
      ':after': {
        content: '"THIS IS CORE!!!!"'
      }
    }
  }, children));
}

export { Core, useBrand };
`;
		const filePath = path.normalize(`${dir}/core/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}core.esm.js`, content, { encoding: 'utf8' });
	},
	src1: ({ dir }) => {
		const content = `/** @jsx jsx */

import { jsx } from '@emotion/core';
import { createContext, useContext } from 'react';

export const BrandContext = createContext();

export const useBrand = () => {
	const brandObject = useContext(BrandContext);
	const errorMessage = \`You need to wrap all your components in the <Core/> component.\`;

	if (!brandObject) {
		throw new Error(errorMessage);
	}

	return brandObject;
};

export function Core({ brand, children }) {
	return (
		<BrandContext.Provider value={brand}>
			<div
				css={{
					label: \`core\`,
					background: 'rebeccapurple',
					':after': {
						content: '"THIS IS CORE!!!!"',
					},
				}}
			>
				{children}
			</div>
		</BrandContext.Provider>
	);
}
`;
		const filePath = path.normalize(`${dir}/core/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}Core.js`, content, { encoding: 'utf8' });
	},
	src2: ({ dir }) => {
		const content = `export { Core, useBrand } from './Core';
`;
		const filePath = path.normalize(`${dir}/core/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}index.js`, content, { encoding: 'utf8' });
	},
	pkg: ({ dir, scope = '@westpac/' }) => {
		const content = `{
	"name": "${scope}core",
	"version": "3.17.0",
	"description": "A core component ${scope === '' ? 'out of scope ' : ''}supporting jquery",
	"blender": {
		"recipe": "blender/recipe.js",
		"jquery": "blender/jquery.js",
		"isCore": true
	},
	"dependencies": {
		"@emotion/core": "^10.0.28"
	},
	"peerDependencies": {
		"react": "^16.11.0"
	},
	"main": "dist/core.cjs.js",
	"module": "dist/core.esm.js",
	"files": [
		"blender/*.js",
		"dist/"
	],
	"devDependencies": {
		"react": "^16.13.0"
	}
}
`;
		const filePath = path.normalize(`${dir}/core/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}package.json`, content, { encoding: 'utf8' });
	},
};

// BRAND TEMPLATE
const templateBrand = {
	dist1: ({ dir }) => {
		const content = `'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bodyFont = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif';
var brandFont = '"brandFontWBC"';
var OVERRIDES = function OVERRIDES() {};
var COLORS = {
  color1: '#ff0000',
  color2: '#ffff00',
  color3: '#ffffff',
  tints: {
    color15: '#FFF2F2',
    color110: '#FFE6E6',
    color120: '#FFCCCC',
    color130: '#FFB3B3',
    color140: '#FF9999',
    color150: '#FF8080',
    color160: '#FF6666',
    color170: '#FF4D4D',
    color180: '#FF3333',
    color190: '#FF1919',
    color25: '#FFFFF2',
    color210: '#FFFFE6',
    color220: '#FFFFCC',
    color230: '#FFFFB3',
    color240: '#FFFF99',
    color250: '#FFFF80',
    color260: '#FFFF66',
    color270: '#FFFF4D',
    color280: '#FFFF33',
    color290: '#FFFF19',
    color35: '#FFFFFF',
    color310: '#FFFFFF',
    color320: '#FFFFFF',
    color330: '#FFFFFF',
    color340: '#FFFFFF',
    color350: '#FFFFFF',
    color360: '#FFFFFF',
    color370: '#FFFFFF',
    color380: '#FFFFFF',
    color390: '#FFFFFF'
  }
};
var SPACING = function SPACING(i, minor) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rem';
  return (i * 6 - (minor && i !== 0 ? 3 : 0)) / 16 + (unit ? i > 0 ? unit : 0 : 0);
};
var LAYOUT = {
  breakpoints: {
    sm: 100,
    md: 400,
    lg: 800
  }
};
var TYPE = {
  files: {
    "": [{
      "@font-face": {
        "fontFamily": "\\"some-other-family\\"",
        "src": "url(\\"_PATH_some-other-family-light.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-light.woff\\") format(\\"woff\\")",
        "fontWeight": "300",
        "fontStyle": "normal"
      }
    }, {
      "@font-face": {
        "fontFamily": "\\"some-other-family\\"",
        "src": "url(\\"_PATH_some-other-family-regular.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-regular.woff\\") format(\\"woff\\")",
        "fontWeight": "400",
        "fontStyle": "normal"
      }
    }, {
      "@font-face": {
        "fontFamily": "\\"some-other-family\\"",
        "src": "url(\\"_PATH_some-other-family-bold.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-bold.woff\\") format(\\"woff\\")",
        "fontWeight": "700",
        "fontStyle": "normal"
      }
    }]
  },
  bodyFont: {
    fontFamily: bodyFont,
    100: {
      fontFamily: bodyFont,
      fontWeight: 100
    },
    200: {
      fontFamily: bodyFont,
      fontWeight: 200
    },
    300: {
      fontFamily: bodyFont,
      fontWeight: 300
    },
    400: {
      fontFamily: bodyFont,
      fontWeight: 400
    },
    500: {
      fontFamily: bodyFont,
      fontWeight: 500
    },
    600: {
      fontFamily: bodyFont,
      fontWeight: 600
    },
    700: {
      fontFamily: bodyFont,
      fontWeight: 700
    },
    800: {
      fontFamily: bodyFont,
      fontWeight: 800
    },
    900: {
      fontFamily: bodyFont,
      fontWeight: 900
    }
  },
  brandFont: {
    fontFamily: brandFont,
    100: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    200: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    300: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    400: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    500: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    600: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    700: {
      fontFamily: brandFont,
      fontWeight: 700
    },
    800: {
      fontFamily: brandFont,
      fontWeight: 700
    },
    900: {
      fontFamily: brandFont,
      fontWeight: 700
    }
  }
};
var PACKS = {
  headline: {
    1: {
      fontWeight: 700,
      fontSize: '3.375rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    3: {
      fontWeight: 700,
      fontSize: '2.625rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    4: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    5: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    6: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    7: {
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    8: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    9: {
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    }
  },
  lead: {
    marginBottom: '1.3125rem',
    fontSize: ['1rem', '1.125rem'],
    fontWeight: 300,
    lineHeight: 1.4
  },
  link: {
    color: COLORS.color1,
    textDecoration: 'underline',
    ':hover': {
      color: COLORS.color2,
      textDecoration: 'underline'
    }
  },
  focus: {
    outline: "solid ".concat(COLORS.color3),
    outlineOffset: '3px'
  }
};
var BRAND = "WBC";
var index = {
  OVERRIDES: OVERRIDES,
  COLORS: COLORS,
  SPACING: SPACING,
  LAYOUT: LAYOUT,
  TYPE: TYPE,
  PACKS: PACKS,
  BRAND: BRAND
};

exports.BRAND = BRAND;
exports.COLORS = COLORS;
exports.LAYOUT = LAYOUT;
exports.OVERRIDES = OVERRIDES;
exports.PACKS = PACKS;
exports.SPACING = SPACING;
exports.TYPE = TYPE;
exports.default = index;
`;
		const filePath = path.normalize(`${dir}/wbc/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}wbc.cjs.dev.js`, content, { encoding: 'utf8' });
	},
	dist2: ({ dir }) => {
		const content = `'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./wbc.cjs.prod.js");
} else {
  module.exports = require("./wbc.cjs.dev.js");
}
`;
		const filePath = path.normalize(`${dir}/wbc/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}wbc.cjs.js`, content, { encoding: 'utf8' });
	},
	dist3: ({ dir }) => {
		const content = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var bodyFont = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif', brandFont = '"brandFontWBC"', OVERRIDES = function() {}, COLORS = {
  color1: "#ff0000",
  color2: "#ffff00",
  color3: "#ffffff",
  tints: {
    color15: "#FFF2F2",
    color110: "#FFE6E6",
    color120: "#FFCCCC",
    color130: "#FFB3B3",
    color140: "#FF9999",
    color150: "#FF8080",
    color160: "#FF6666",
    color170: "#FF4D4D",
    color180: "#FF3333",
    color190: "#FF1919",
    color25: "#FFFFF2",
    color210: "#FFFFE6",
    color220: "#FFFFCC",
    color230: "#FFFFB3",
    color240: "#FFFF99",
    color250: "#FFFF80",
    color260: "#FFFF66",
    color270: "#FFFF4D",
    color280: "#FFFF33",
    color290: "#FFFF19",
    color35: "#FFFFFF",
    color310: "#FFFFFF",
    color320: "#FFFFFF",
    color330: "#FFFFFF",
    color340: "#FFFFFF",
    color350: "#FFFFFF",
    color360: "#FFFFFF",
    color370: "#FFFFFF",
    color380: "#FFFFFF",
    color390: "#FFFFFF"
  }
}, SPACING = function(i, minor) {
  var unit = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "rem";
  return (6 * i - (minor && 0 !== i ? 3 : 0)) / 16 + (unit && i > 0 ? unit : 0);
}, LAYOUT = {
  breakpoints: {
    sm: 100,
    md: 400,
    lg: 800
  }
}, TYPE = {
  files: {
    "": [ {
      "@font-face": {
        fontFamily: '"some-other-family"',
        src: 'url("_PATH_some-other-family-light.woff2") format("woff2"), url("_PATH_some-other-family-light.woff") format("woff")',
        fontWeight: "300",
        fontStyle: "normal"
      }
    }, {
      "@font-face": {
        fontFamily: '"some-other-family"',
        src: 'url("_PATH_some-other-family-regular.woff2") format("woff2"), url("_PATH_some-other-family-regular.woff") format("woff")',
        fontWeight: "400",
        fontStyle: "normal"
      }
    }, {
      "@font-face": {
        fontFamily: '"some-other-family"',
        src: 'url("_PATH_some-other-family-bold.woff2") format("woff2"), url("_PATH_some-other-family-bold.woff") format("woff")',
        fontWeight: "700",
        fontStyle: "normal"
      }
    } ]
  },
  bodyFont: {
    fontFamily: bodyFont,
    100: {
      fontFamily: bodyFont,
      fontWeight: 100
    },
    200: {
      fontFamily: bodyFont,
      fontWeight: 200
    },
    300: {
      fontFamily: bodyFont,
      fontWeight: 300
    },
    400: {
      fontFamily: bodyFont,
      fontWeight: 400
    },
    500: {
      fontFamily: bodyFont,
      fontWeight: 500
    },
    600: {
      fontFamily: bodyFont,
      fontWeight: 600
    },
    700: {
      fontFamily: bodyFont,
      fontWeight: 700
    },
    800: {
      fontFamily: bodyFont,
      fontWeight: 800
    },
    900: {
      fontFamily: bodyFont,
      fontWeight: 900
    }
  },
  brandFont: {
    fontFamily: brandFont,
    100: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    200: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    300: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    400: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    500: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    600: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    700: {
      fontFamily: brandFont,
      fontWeight: 700
    },
    800: {
      fontFamily: brandFont,
      fontWeight: 700
    },
    900: {
      fontFamily: brandFont,
      fontWeight: 700
    }
  }
}, PACKS = {
  headline: {
    1: {
      fontWeight: 700,
      fontSize: "3.375rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    2: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    3: {
      fontWeight: 700,
      fontSize: "2.625rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    4: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    5: {
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    6: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    7: {
      fontWeight: 700,
      fontSize: "1.125rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    8: {
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    9: {
      fontWeight: 700,
      fontSize: "0.875rem",
      lineHeight: 1.2,
      fontFamily: bodyFont
    }
  },
  lead: {
    marginBottom: "1.3125rem",
    fontSize: [ "1rem", "1.125rem" ],
    fontWeight: 300,
    lineHeight: 1.4
  },
  link: {
    color: COLORS.color1,
    textDecoration: "underline",
    ":hover": {
      color: COLORS.color2,
      textDecoration: "underline"
    }
  },
  focus: {
    outline: "solid ".concat(COLORS.color3),
    outlineOffset: "3px"
  }
}, BRAND = "WBC", index = {
  OVERRIDES: OVERRIDES,
  COLORS: COLORS,
  SPACING: SPACING,
  LAYOUT: LAYOUT,
  TYPE: TYPE,
  PACKS: PACKS,
  BRAND: BRAND
};

exports.BRAND = BRAND, exports.COLORS = COLORS, exports.LAYOUT = LAYOUT, exports.OVERRIDES = OVERRIDES,
exports.PACKS = PACKS, exports.SPACING = SPACING, exports.TYPE = TYPE, exports.default = index;
`;
		const filePath = path.normalize(`${dir}/wbc/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}wbc.cjs.prod.js`, content, { encoding: 'utf8' });
	},
	dist4: ({ dir }) => {
		const content = `var bodyFont = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif';
var brandFont = '"brandFontWBC"';
var OVERRIDES = function OVERRIDES() {};
var COLORS = {
  color1: '#ff0000',
  color2: '#ffff00',
  color3: '#ffffff',
  tints: {
    color15: '#FFF2F2',
    color110: '#FFE6E6',
    color120: '#FFCCCC',
    color130: '#FFB3B3',
    color140: '#FF9999',
    color150: '#FF8080',
    color160: '#FF6666',
    color170: '#FF4D4D',
    color180: '#FF3333',
    color190: '#FF1919',
    color25: '#FFFFF2',
    color210: '#FFFFE6',
    color220: '#FFFFCC',
    color230: '#FFFFB3',
    color240: '#FFFF99',
    color250: '#FFFF80',
    color260: '#FFFF66',
    color270: '#FFFF4D',
    color280: '#FFFF33',
    color290: '#FFFF19',
    color35: '#FFFFFF',
    color310: '#FFFFFF',
    color320: '#FFFFFF',
    color330: '#FFFFFF',
    color340: '#FFFFFF',
    color350: '#FFFFFF',
    color360: '#FFFFFF',
    color370: '#FFFFFF',
    color380: '#FFFFFF',
    color390: '#FFFFFF'
  }
};
var SPACING = function SPACING(i, minor) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rem';
  return (i * 6 - (minor && i !== 0 ? 3 : 0)) / 16 + (unit ? i > 0 ? unit : 0 : 0);
};
var LAYOUT = {
  breakpoints: {
    sm: 100,
    md: 400,
    lg: 800
  }
};
var TYPE = {
  files: {
    "": [{
      "@font-face": {
        "fontFamily": "\\"some-other-family\\"",
        "src": "url(\\"_PATH_some-other-family-light.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-light.woff\\") format(\\"woff\\")",
        "fontWeight": "300",
        "fontStyle": "normal"
      }
    }, {
      "@font-face": {
        "fontFamily": "\\"some-other-family\\"",
        "src": "url(\\"_PATH_some-other-family-regular.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-regular.woff\\") format(\\"woff\\")",
        "fontWeight": "400",
        "fontStyle": "normal"
      }
    }, {
      "@font-face": {
        "fontFamily": "\\"some-other-family\\"",
        "src": "url(\\"_PATH_some-other-family-bold.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-bold.woff\\") format(\\"woff\\")",
        "fontWeight": "700",
        "fontStyle": "normal"
      }
    }]
  },
  bodyFont: {
    fontFamily: bodyFont,
    100: {
      fontFamily: bodyFont,
      fontWeight: 100
    },
    200: {
      fontFamily: bodyFont,
      fontWeight: 200
    },
    300: {
      fontFamily: bodyFont,
      fontWeight: 300
    },
    400: {
      fontFamily: bodyFont,
      fontWeight: 400
    },
    500: {
      fontFamily: bodyFont,
      fontWeight: 500
    },
    600: {
      fontFamily: bodyFont,
      fontWeight: 600
    },
    700: {
      fontFamily: bodyFont,
      fontWeight: 700
    },
    800: {
      fontFamily: bodyFont,
      fontWeight: 800
    },
    900: {
      fontFamily: bodyFont,
      fontWeight: 900
    }
  },
  brandFont: {
    fontFamily: brandFont,
    100: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    200: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    300: {
      fontFamily: brandFont,
      fontWeight: 300
    },
    400: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    500: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    600: {
      fontFamily: brandFont,
      fontWeight: 400
    },
    700: {
      fontFamily: brandFont,
      fontWeight: 700
    },
    800: {
      fontFamily: brandFont,
      fontWeight: 700
    },
    900: {
      fontFamily: brandFont,
      fontWeight: 700
    }
  }
};
var PACKS = {
  headline: {
    1: {
      fontWeight: 700,
      fontSize: '3.375rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    3: {
      fontWeight: 700,
      fontSize: '2.625rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    4: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    5: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    6: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    7: {
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    8: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    },
    9: {
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.2,
      fontFamily: bodyFont
    }
  },
  lead: {
    marginBottom: '1.3125rem',
    fontSize: ['1rem', '1.125rem'],
    fontWeight: 300,
    lineHeight: 1.4
  },
  link: {
    color: COLORS.color1,
    textDecoration: 'underline',
    ':hover': {
      color: COLORS.color2,
      textDecoration: 'underline'
    }
  },
  focus: {
    outline: "solid ".concat(COLORS.color3),
    outlineOffset: '3px'
  }
};
var BRAND = "WBC";
var index = {
  OVERRIDES: OVERRIDES,
  COLORS: COLORS,
  SPACING: SPACING,
  LAYOUT: LAYOUT,
  TYPE: TYPE,
  PACKS: PACKS,
  BRAND: BRAND
};

export default index;
export { BRAND, COLORS, LAYOUT, OVERRIDES, PACKS, SPACING, TYPE };
`;
		const filePath = path.normalize(`${dir}/wbc/dist/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}wbc.esm.js`, content, { encoding: 'utf8' });
	},
	src1: ({ dir }) => {
		const content = `const bodyFont = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif';
const brandFont = '"brandFontWBC"';

export const OVERRIDES = () => {};

export const COLORS = {
	color1: '#ff0000',
	color2: '#ffff00',
	color3: '#ffffff',

	tints: {
		color15: '#FFF2F2',
		color110: '#FFE6E6',
		color120: '#FFCCCC',
		color130: '#FFB3B3',
		color140: '#FF9999',
		color150: '#FF8080',
		color160: '#FF6666',
		color170: '#FF4D4D',
		color180: '#FF3333',
		color190: '#FF1919',
		color25: '#FFFFF2',
		color210: '#FFFFE6',
		color220: '#FFFFCC',
		color230: '#FFFFB3',
		color240: '#FFFF99',
		color250: '#FFFF80',
		color260: '#FFFF66',
		color270: '#FFFF4D',
		color280: '#FFFF33',
		color290: '#FFFF19',
		color35: '#FFFFFF',
		color310: '#FFFFFF',
		color320: '#FFFFFF',
		color330: '#FFFFFF',
		color340: '#FFFFFF',
		color350: '#FFFFFF',
		color360: '#FFFFFF',
		color370: '#FFFFFF',
		color380: '#FFFFFF',
		color390: '#FFFFFF',
	},
};

export const SPACING = ( i, minor, unit = 'rem' ) => {
	return ( i * 6 - (minor && i !== 0 ? 3 : 0) ) / 16 + (unit ? (i > 0 ? unit : 0) : 0);
};

export const LAYOUT = {
	breakpoints: {
		sm: 100,
		md: 400,
		lg: 800,
	},
};

export const TYPE = {
	files: {
		"": [{
			"@font-face": {
				"fontFamily": "\\"some-other-family\\"",
				"src": "url(\\"_PATH_some-other-family-light.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-light.woff\\") format(\\"woff\\")",
				"fontWeight": "300",
				"fontStyle": "normal"
			}
		}, {
			"@font-face": {
				"fontFamily": "\\"some-other-family\\"",
				"src": "url(\\"_PATH_some-other-family-regular.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-regular.woff\\") format(\\"woff\\")",
				"fontWeight": "400",
				"fontStyle": "normal"
			}
		}, {
			"@font-face": {
				"fontFamily": "\\"some-other-family\\"",
				"src": "url(\\"_PATH_some-other-family-bold.woff2\\") format(\\"woff2\\"), url(\\"_PATH_some-other-family-bold.woff\\") format(\\"woff\\")",
				"fontWeight": "700",
				"fontStyle": "normal"
			}
		}]
	},
	bodyFont: {
		fontFamily: bodyFont,
		100: {
			fontFamily: bodyFont,
			fontWeight: 100
		},
		200: {
			fontFamily: bodyFont,
			fontWeight: 200
		},
		300: {
			fontFamily: bodyFont,
			fontWeight: 300
		},
		400: {
			fontFamily: bodyFont,
			fontWeight: 400
		},
		500: {
			fontFamily: bodyFont,
			fontWeight: 500
		},
		600: {
			fontFamily: bodyFont,
			fontWeight: 600
		},
		700: {
			fontFamily: bodyFont,
			fontWeight: 700
		},
		800: {
			fontFamily: bodyFont,
			fontWeight: 800
		},
		900: {
			fontFamily: bodyFont,
			fontWeight: 900
		}
	},
	brandFont: {
		fontFamily: brandFont,
		100: {
			fontFamily: brandFont,
			fontWeight: 300
		},
		200: {
			fontFamily: brandFont,
			fontWeight: 300
		},
		300: {
			fontFamily: brandFont,
			fontWeight: 300
		},
		400: {
			fontFamily: brandFont,
			fontWeight: 400
		},
		500: {
			fontFamily: brandFont,
			fontWeight: 400
		},
		600: {
			fontFamily: brandFont,
			fontWeight: 400
		},
		700: {
			fontFamily: brandFont,
			fontWeight: 700
		},
		800: {
			fontFamily: brandFont,
			fontWeight: 700
		},
		900: {
			fontFamily: brandFont,
			fontWeight: 700
		}
	}
};

export const PACKS = {
	headline: {
		1: {
			fontWeight: 700,
			fontSize: '3.375rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		2: {
			fontWeight: 700,
			fontSize: '3rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		3: {
			fontWeight: 700,
			fontSize: '2.625rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		4: {
			fontWeight: 700,
			fontSize: '2.25rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		5: {
			fontWeight: 700,
			fontSize: '1.875rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		6: {
			fontWeight: 700,
			fontSize: '1.5rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		7: {
			fontWeight: 700,
			fontSize: '1.125rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		8: {
			fontWeight: 700,
			fontSize: '1rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
		9: {
			fontWeight: 700,
			fontSize: '0.875rem',
			lineHeight: 1.2,
			fontFamily: bodyFont,
		},
	},
	lead: {
		marginBottom: '1.3125rem',
		fontSize: ['1rem', '1.125rem'],
		fontWeight: 300,
		lineHeight: 1.4,
	},
	link: {
		color: COLORS.color1,
		textDecoration: 'underline',
		':hover': {
			color: COLORS.color2,
			textDecoration: 'underline',
		},
	},
	focus: {
		outline: \`solid $\{COLORS.color3}\`,
		outlineOffset: '3px',
	},
};

export const BRAND = "WBC";

export default {
	OVERRIDES,
	COLORS,
	SPACING,
	LAYOUT,
	TYPE,
	PACKS,
	BRAND,
};
`;
		const filePath = path.normalize(`${dir}/wbc/src/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}index.js`, content, { encoding: 'utf8' });
	},
	pkg: ({ dir, scope = '@westpac/' }) => {
		const content = `{
	"name": "${scope}wbc",
	"version": "1.0.0",
	"description": "A brand component",
	"blender": {
		"tokens": true
	},
	"main": "dist/wbc.cjs.js",
	"module": "dist/wbc.esm.js",
	"files": [
		"blender/*.js",
		"dist/"
	]
}
`;
		const filePath = path.normalize(`${dir}/wbc/`);
		createDir(filePath);
		fs.writeFileSync(`${filePath}package.json`, content, { encoding: 'utf8' });
	},
};

let i;
let dir;
// A simple project with a couple in-scope and out-of-scope packages
if (process.argv.includes('project1')) {
	dir = path.normalize(`${__dirname}/mock-project1/node_modules/@westpac/`);
	const dir2 = path.normalize(`${__dirname}/mock-project1/node_modules/`);

	Object.entries(templateStd).map(([_, func]) => func({ num: 1, dir }));
	Object.entries(templateStd)
		.filter(([key]) => key !== 'blender1')
		.map(([_, func]) => func({ num: 2, dir, scope: '@westpac/', jquery: false }));
	Object.entries(templateNonBlender).map(([_, func]) => func({ num: 3, dir }));
	Object.entries(templateCore).map(([_, func]) => func({ dir }));
	Object.entries(templateBrand).map(([_, func]) => func({ dir }));
	Object.entries(templateStd).map(([_, func]) => func({ num: 4, dir: dir2, scope: '' }));
	Object.entries(templateStd).map(([_, func]) => func({ num: 5, dir: dir2, scope: '' }));
	i = 6;
}
// A project with lot's of packages
else if (process.argv.includes('project2')) {
	dir = path.normalize(`${__dirname}/mock-project2/node_modules/@westpac/`);

	for (i = 1; i < 56; i++) {
		Object.entries(templateStd).map(([_, func]) => func({ num: i, dir }));
	}
	i--;
	Object.entries(templateCore).map(([_, func]) => func({ dir }));
	Object.entries(templateBrand).map(([_, func]) => func({ dir }));
	i += 2;
}
// A project with invalid packages
else if (process.argv.includes('project3')) {
	dir = path.normalize(`${__dirname}/mock-project3/node_modules/@westpac/`);

	Object.entries(templateStd).map(([_, func]) => func({ num: 1, dir }));
	Object.entries(templateStd)
		.filter(([key]) => key !== 'blender1')
		.map(([_, func]) => func({ num: 2, dir, scope: '@westpac/', jquery: false }));
	Object.entries(templateNonBlender).map(([_, func]) => func({ num: 3, dir }));
	Object.entries(templateInvalid).map(([_, func]) => func({ num: 6, dir }));
	Object.entries(templateCore).map(([_, func]) => func({ dir }));
	Object.entries(templateBrand).map(([_, func]) => func({ dir }));
	i = 6;
}
// A project with two different scopes
else if (process.argv.includes('project4')) {
	dir = path.normalize(`${__dirname}/mock-project4/node_modules/@westpac/`);

	Object.entries(templateStd).map(([_, func]) => func({ num: 1, dir }));
	Object.entries(templateStd)
		.filter(([key]) => key !== 'blender1')
		.map(([_, func]) => func({ num: 2, dir, scope: '@westpac/', jquery: false }));
	Object.entries(templateNonBlender).map(([_, func]) => func({ num: 3, dir }));
	Object.entries(templateCore).map(([_, func]) => func({ dir }));
	Object.entries(templateBrand).map(([_, func]) => func({ dir }));

	dir = path.normalize(`${__dirname}/mock-project4/node_modules/@bank/`);

	Object.entries(templateStd).map(([_, func]) =>
		func({ num: 1, dir, scope: '@bank/', core: '@bank/' })
	);
	Object.entries(templateStd)
		.filter(([key]) => key !== 'blender1')
		.map(([_, func]) => func({ num: 2, dir, scope: '@bank/', jquery: false, core: '@bank/' }));
	Object.entries(templateNonBlender).map(([_, func]) =>
		func({ num: 3, dir, scope: '@bank/', core: '@bank/' })
	);
	Object.entries(templateCore).map(([_, func]) => func({ dir, scope: '@bank/' }));
	Object.entries(templateBrand).map(([_, func]) => func({ dir, scope: '@bank/' }));

	i = 10;
} else {
	console.log('No project selected.');
}

if (i) {
	console.log(`Finished creating ${color.yellow(i)} folders in ${color.yellow(dir)}`);
}
