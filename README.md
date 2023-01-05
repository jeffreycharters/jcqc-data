# JCQC Data Processor

At my work as an analytical chemist, we crunch through a lot of data-intensive tasks.

This is an application to automate the processing of our ICP-MS output.

## Installation

This application requires a [pocketbase](https://pocketbase.io) backend to be running. At the moment there are no migration to automate the initial creation of the required tables.

If you want to try running the application anyway, fork it into a new directory and run the development server `npm run dev`.

## Production

This [Sveltekit](https://kit.svelte.dev) application has been created as a static site in order to be served by the pocketbase backend, thus obviating the need for a dedicated server. Users will be able to run a Windows batch file which will start the pocketbase server for them and launch a browser window pointing to the application.

## TODO

Everything. Including but not limited to:
- [ ] Create migration scripts for database including sane initial states.
- [ ] Allow upload and processing of comma-separated value files (csv files)
- [ ] Allow users to create new methods and QC files.
- [ ] Allow users to edit existing methods and QC files.
- [ ] Lots more as I think of it.

Stay tuned!