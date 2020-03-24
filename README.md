# Blender [![CircleCI](https://circleci.com/gh/WestpacGEL/blender/tree/master.svg?style=svg)](https://circleci.com/gh/WestpacGEL/blender/tree/master)

## Scripts

| name                | description                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `build`             | Building the source files and moving them into `lib/` and `bin/` folder                   |
| `build:lib`         | Building all lib files. Changing these files won't break symlinks created with `npm link` |
| `build:bin`         | Moving the `bin.js` file from `lib/` to `bin/` and renaming it to `index.js`              |
| `watch`             | Watching all files inside `src/` for changes and running `build:lib` if detected          |
| `format`            | Format all code with prettier                                                             |
| `test`              | Run all tests                                                                             |
| `test:format`       | Testing for code style differences                                                        |
| `test:unit`         | Run all unit Jest tests                                                                   |
| `test:unit-watch`   | Run Jest in watch mode                                                                    |
| `test:types`        | Run all type tests                                                                        |
| `types:clean`       | Cleans all type definition files generated by `types:declaration`                         |
| `types:declaration` | Build type declaration files                                                              |
| `nuke`              | Remove all artifacts from including `node_modules` folder and lock files                  |
| `fresh`             | Run `nuke` and `yarn` in sequence                                                         |

## TODO

- test script: - iterates the `ids` - checks if the `id` exists in the css output - checks if hash is different for same label

```
{
	ids: [
		"1jr47et",       // ignored cause it doesn't exists in css output
		"dj1fv6",        // ignored cause it doesn't exists in css output
		"vctdvy-alert",
		"epbyb1-thing",  // found bug
		"x1b3bk-thing",  // because these two have same label but different hash
		"7qw58u-foo",
		"1sa041k-bar",
	],
	css: "...",
	html: "..."
}
```

- blender script - looks into `package.json` for settings and merges them with cli settings

```
blender: {
  brand: 'WBC',
  output: {
    css: 'path/to/css',
    js: 'path/to/js',
    html: false,              // false disabled the generation
    tokens: 'path/to/tokens',
  },
  output: 'path/to/all',      // will put all files in the same folder
  scope: '@westpac',          // not hardcoded
  include: [                  // whitelist
    '@westpac/alert',
    '@westpac/button',
  ],
  exclude: [                  // blacklist
    '@westpac/tabcordion',
  ],
  prettify: true,
  includeJQuery: false,
  modules: true,
  versionInClass: false,
  tokensFormat: 'less',
}
```

CLI options:

```sh
blender
	-b WBC                                # --brand
	-o path/to                            # --output
	--output-css path/to/css
	--output-js path/to/js
	--output-html path/to/html
	--output-zip
	-s "@westpac"                         # --scope
	-i "@westpac/button","@westpac/alert" # --include
	-x "@westpac/button","@westpac/alert" # --exclude
	-p                                    # --prettify
	-j                                    # --include-jquery
	-m                                    # --modules
	-c                                    # --version-in-class
	-t less                               # --tokens-format
	-d                                    # --debug
	-v                                    # --version
```

- iterates over each component (https://babeljs.io/docs/en/babel-register/) - generates the critical styles from the recipe file (includes all variations of the component) - generates the html from the template (includes only those that go into docs) - takes ids - removes hashes and `css-` prefix - adds package version - build html file with example codes for each component (a file per component plus an index file) - build css file - separate core - export js file for all tokens - remove all core css from each component - add core as separate thing on top - build js file (concat) - optionally include jquery file - zip it all up - profit

## Arch

```
                      ┌────────────────────────────────┐
                      │             Common             │
                      │                                │
                      │ ┌────────────────────────────┐ │
                      │ │        get settings        │ │
                      │ └────────────────────────────┘ │
                      │ ┌────────────────────────────┐ │
                      │ │        get modules         │ │
                      │ └────────────────────────────┘ │
                      └────────────────────────────────┘
                                       │
                                 ┌─────┴─────┐
                 ┌───────────────┤  modules  ├────────────────┐
                 │               └───────────┘                │
                 ▼                                            ▼
┌────────────────────────────────┐           ┌────────────────────────────────┐
│             Tester             │           │            Blender             │
│ ┌────────────────────────────┐ │           │ ┌────────────────────────────┐ │
│ │        modules loop        │ │           │ │      get core styles       │ │
│ │                            │ │           │ └────────────────────────────┘ │
│ │┌──────────────────────────┐│ │           │ ┌────────────────────────────┐ │
│ ││      compile module      ││ │           │ │        build tokens        │ │
│ │└──────────────────────────┘│ │           │ └────────────────────────────┘ │
│ │                            │ │           │                                │
│ │┌──────────────────────────┐│ │           │ ┌────────────────────────────┐ │
│ ││         ids loop         ││ │           │ │        modules loop        │ │
│ ││                          ││ │           │ │                            │ │
│ ││┌────────────────────────┐││ │           │ │┌──────────────────────────┐│ │
│ │││    check id exists     │││ │           │ ││      compile module      ││ │
│ ││└────────────────────────┘││ │           │ │└──────────────────────────┘│ │
│ ││┌────────────────────────┐││ │           │ │┌──────────────────────────┐│ │
│ │││  check id duplication  │││ │           │ ││      get docs html       ││ │
│ ││└────────────────────────┘││ │           │ │└──────────────────────────┘│ │
│ ││┌────────────────────────┐││ │           │ │┌──────────────────────────┐│ │
│ │││     collect errors     │││ │           │ ││    get recipe styles     ││ │
│ ││└────────────────────────┘││ │           │ │└──────────────────────────┘│ │
│ │└──────────────────────────┘│ │           │ │┌──────────────────────────┐│ │
│ └────────────────────────────┘ │           │ ││         ids loop         ││ │
└────────────────────────────────┘           │ ││                          ││ │
                                             │ ││┌────────────────────────┐││ │
                                             │ │││  generate class names  │││ │
                                             │ ││└────────────────────────┘││ │
                                             │ ││┌────────────────────────┐││ │
                                             │ │││ replace prefix in css  │││ │
                                             │ ││└────────────────────────┘││ │
                                             │ ││                          ││ │
                                             │ ││                          ││ │
                                             │ ││                          ││ │
                                             │ │└──────────────────────────┘│ │
                                             │ │┌──────────────────────────┐│ │
                                             │ ││    build html file(s)    ││ │
                                             │ │└──────────────────────────┘│ │
                                             │ │┌──────────────────────────┐│ │
                                             │ ││    build css file(s)     ││ │
                                             │ │└──────────────────────────┘│ │
                                             │ │┌──────────────────────────┐│ │
                                             │ ││    concat js file(s)     ││ │
                                             │ │└──────────────────────────┘│ │
                                             │ └────────────────────────────┘ │
                                             │ ┌────────────────────────────┐ │
                                             │ │            zip             │ │
                                             │ └────────────────────────────┘ │
                                             └────────────────────────────────┘

┌────────────────────────────────┐
│             Utils              │
│                                │
│ ┌────────────────────────────┐ │
│ │         logger cli         │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │       logger errors        │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │        list errors         │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ fs functions (open, write) │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │       compile module       │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │       parse cli args       │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```
