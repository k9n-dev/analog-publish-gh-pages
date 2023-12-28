# Analog Publish Github Pages

[![GitHub Super-Linter](https://github.com/d-koppenhagen/analog-publish-gh-pages/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/d-koppenhagen/analog-publish-gh-pages/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/d-koppenhagen/analog-publish-gh-pages/actions/workflows/check-dist.yml/badge.svg)](https://github.com/d-koppenhagen/analog-publish-gh-pages/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/d-koppenhagen/analog-publish-gh-pages/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/d-koppenhagen/analog-publish-gh-pages/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Build a static [Analog.js](https://analogjs.org/) site and deploy it on Github Pages.

## Versions and Compatibility

## Usage

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - 'main'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - uses: analog-publish-gh-pages
        with:
          # Required: token to access / deploy on Github Pages
          access-token: ${{ secrets.ACCESS_TOKEN }}
          # Optional: arguments passed to `npm ci`
          install-args: "--legacy-peer-deps"
          # Optional: arguments passed to `npm run build`
          build-args: ""
          # Optional: the directory after build process to deploy (defaults to `dist/analog/public`)
          deploy-dir: "dist/analog/public"
          # Optional: arguments passed to `npx angular-cli-ghpages`
          deploy-args: "--dry-run" # important: --dry-run won't actually deploy the site!
```

## Assumptions

### Build command

The `build` script of your `package.json` is executed by this action.
Additional arguments can be passed by setting `build-args`.

### `CNAME` file

You have a custom domain you would like to use? Fancy! 😎 This Action's got you
covered! Assuming you have already set up your DNS provider as defined in the
[GitHub Pages docs][github-pages-domain-docs], all we need next is a `CNAME`
file at the root of your project with the domain you would like to use. For
example:

```CNAME
example.com
```

### `.nojekyll` file

Analog.js creates files starting with an underscore (`_`) during the build process.
By default Github Pages assumes a Jekyll project is being published.
This assumption comes with the fact, all files starting with `_` are being ignored.
To fix this, the actions adds a `.nojekyll` file to the destination directory and places it in the root on the `gh-pages` branch.

[analog-build-docs]: https://analogjs.org/docs/getting-started#building-the-application
[github-access-token]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line
[github-action-input]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#using-encrypted-secrets-in-a-workflow
[github-pages-domain-docs]: https://help.github.com/en/articles/using-a-custom-domain-with-github-pages
[github-repo-secret]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets
