# vs-code-esmock README

This extension helps you to start a new tets suit from scratch with [esmock](https://www.npmjs.com/package/esmock)

> ⚠️ **Important**: Result test works with Node's test runner, that means you should work with Node version >= 18.0.0

## Usage

1. Create an empty file in which test is going to be added
2. Open the VS Code command palette with ```Ctrl+Shift+P```, and run _init test_

## Commands

The extension provides one command:

- _init test_: allows to select which file is going to be tested and returns on the empty open file the a dummy test with all mocked imports

    > This extension only works with ```.js``` or ```.ts``` files
