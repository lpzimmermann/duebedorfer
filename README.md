# Dübendorfer

A web app for counting points in Dübendorfer, a Swiss Jass variant.

Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vite.dev/).

The rules and scoring logic are not implemented yet — this is the initial app scaffold.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deployment

Pushes to `main` are automatically built and deployed to GitHub Pages via the workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To enable it, set the repository's **Settings → Pages → Source** to "GitHub Actions".
