# nubilo-web

The web frontend for [nubilo](https://github.com/filipeparedes/nubilo), a personal file storage server with versioning, built from scratch in C++. It lets you log in, browse your folders, upload and download files, and inspect and restore the history of each file, in an interface styled after an old text-mode terminal.

## Status

| Feature                                         | Status  |
| ----------------------------------------------- | ------- |
| Project setup and API client                    | Done    |
| Register, login and logout                      | Done    |
| File browser: folders, upload, download, delete | Planned |
| Version history: list, download, restore        | Planned |
| Version comparison                              | Planned |

The goal is for the interface to cover everything the server can do, so that all of it can be tried and tested from the browser.

## Design

A retro terminal look instead of the usual cards and rounded containers: monospace type, small and dense text, square corners, 1px lines and box-drawing characters, a dark background with a single amber accent, and actions written as `[ upload ]`, `[ get ]`, `[ del ]`. Lists look like the output of `ls -l`, and the current folder is shown as a shell prompt.

## Stack

React, TypeScript and Vite, with React Router for the pages, TanStack Query for the requests to the API and plain CSS with custom properties for the styles.

## Requirements

- Node.js
- A running [nubilo server](https://github.com/filipeparedes/nubilo), which must allow this frontend's address through `server.corsOrigin` in its `config.json` (`http://localhost:5173` in development)

## Related repositories

| Repository                                                      | Role                                                            |
| --------------------------------------------------------------- | --------------------------------------------------------------- |
| [nubilo](https://github.com/filipeparedes/nubilo)               | The server and its documentation: REST API, storage, versioning |
| [nubilo-client](https://github.com/filipeparedes/nubilo-client) | A terminal-based desktop client                                 |
| `nubilo-web`                                                    | This repository: the web frontend                               |
