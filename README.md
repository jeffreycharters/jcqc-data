# JCQC Data Processor

At work as an analytical chemist, we crunch through a lot of data-intensive tasks.

This is an application to automate the processing of our ICP-MS output.

## Testing Status

A suite of tests has been written to ensure that all the data-manipulation functions are returning the expected output. These tests are run every time code is pushed to this repository using [Github Actions](https://docs.github.com/en/actions) and the following badge provides the pass/fail status of the tests. Press `CTRL+F5` to hard-reload this page and ensure the badge is up-to-date.

![Testing Status](https://github.com/jeffreycharters/jcqc-data/actions/workflows/run-tests.yaml/badge.svg?branch=main)

The tests are all located in [the ./src/lib/ directory](https://github.com/jeffreycharters/jcqc-data/tree/main/src/lib) and contain `*.test.ts` in their filename.

## Installation

This application requires [Node.js](https://nodejs.org/en) version 20+ to run. Download the code into a clean directory and install dependencies using `npm install` or `pnpm install`. Then you can start the development server with `npm run dev` or `pnpm dev`.
