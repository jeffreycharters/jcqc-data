# JCQC Data Processor

![Testing Status](https://github.com/jeffreycharters/jcqc-data/actions/workflows/run-tests.yaml/badge.svg)

At work as an analytical chemist, we crunch through a lot of data-intensive tasks.

This is an application to automate the processing of our ICP-MS output.

## Installation

If you want to try running the app, fork it into a new directory and run the development server `pnpm run dev`.

## Production

This [Sveltekit](https://kit.svelte.dev) application has been created as a static site. It uses the browser's IndexedDB to store data.
