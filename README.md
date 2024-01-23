# JCQC Data Processor

At work as an analytical chemist, we crunch through a lot of data-intensive tasks.

This is an application to automate the processing of our ICP-MS output.

## Installation

This application requires a [pocketbase](https://pocketbase.io) backend to be running. At the moment there are no migration to automate the initial creation of the required tables.

If you want to try running the application anyway, fork it into a new directory and run the development server `pnpm run dev`.

## Production

This [Sveltekit](https://kit.svelte.dev) application has been created as a static site in order to be served by the pocketbase backend, thus obviating the need for a dedicated server. Users will be able to run a Windows batch file which will start the pocketbase server for them and launch a browser window pointing to the application.

## Status

This project is almost at the point of being considered stable. Most of the main functionality is present.

May undergo a few iterations of improving UI/UX but seems to work well at the moment.

If you work using an Agilent ICPMS and would like help setting this up in your lab, get in touch.
