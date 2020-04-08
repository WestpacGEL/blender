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
	-h path/to/html                       # --output-html
	-t path/to/token                      # --output-token
	-z                                    # --output-zip
	-f less                               # --tokens-format
	-S "@westpac"                         # --scope
	-i "@westpac/button" "@westpac/alert" # --include
	-x "@westpac/button" "@westpac/alert" # --exclude
	-D path/to/cwd                        # --cwd
	-p                                    # --prettify
	-J                                    # --exclude-jquery
	-m                                    # --modules
	-C                                    # --no-version-in-class
	-d                                    # --debug
	-v                                    # --version
	-H                                    # --help
```

An example of running the blender with all flags would be:

```sh
blender -T -b WBC --output path/to/all --output-css path/to/css --output-js path/to/js --output-html path/to/html --output-token path/to/token --output-zip --scope "@westpac" --include "@westpac/button" "@westpac/core" --exclude "@westpac/tabcordion" -pJmCf less -dvH
```

_(💡 Note that you can combine boolean flags together: `blender -pmj` is the same as `blender -p -m -j`)_

## API

Running the tester programmatically is possible via node:

```js
const blender = require('@westopac/blender');

const result = await blender({
	cwd: 'path/to/cwd',
	test: false,
	scope: '@westpac',
	output: 'path/to/all',
	outputCss: 'path/to/css',
	outputJs: 'path/to/js',
	outputHtml: 'path/to/html',
	outputToken: 'path/to/token',
	outputZip: true,
	tokensFormat: 'less',
	include: ['@westpac/button', '@westpac/core'],
	exclude: ['@westpac/tabcordion'],
	prettify: true,
	modules: true,
	brand: 'WBC',
	excludeScripts: false,
	versionInClass: true,
});
```

## Tester

The tester checked labels created by emotion for any hashes that can't be removed.
If the tester finds labels have the same label but a different hash we can't remove the hashes easily and make the classes readable. See below example.

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

## Different usage

Common use cases:

```sh
blender -b WBC -zo .                         # get zip of everything
blender -b WBC -c path/to/css                # get css only
blender -b WBC -j path/to/js                 # get js only
blender -b WBC -h path/to/html               # get html only
blender -b WBC -t path/to/tokens             # get tokens only
blender -b WBC -j path/to/js -h path/to/html # get js and css
```

Cases where flags are ignored or missing:

```sh
blender -o path/to/out                         # error as no brand specified
blender -b WBC -o path/to/out -j path/to/js    # get only js, -o is ignored
blender -b WBC -j path/to/js -z                # error as no output is defined for zip
blender -b WBC -o path/to/out -j path/to/js -z # get zip of everything, -j is ignored
```

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
│             Tester             │           │           Generator             │
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
