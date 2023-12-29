# Analog Publish GitHub Pages

![CI](https://github.com/k9n-dev/analog-publish-gh-pages/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/k9n-dev/analog-publish-gh-pages/actions/workflows/check-dist.yml/badge.svg)](https://github.com/k9n-dev/analog-publish-gh-pages/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/k9n-dev/analog-publish-gh-pages/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/k9n-dev/analog-publish-gh-pages/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Build a static [AnalogJS](https://analogjs.org/) site and deploy it on GitHub
Pages.

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
      - uses: k9n-dev/analog-publish-gh-pages@v1.0.0
        with:
          # Required: token to access / deploy on GitHub Pages
          access-token: ${{ secrets.ACCESS_TOKEN }}
          # Optional: arguments passed to `npm ci`
          install-args: '--legacy-peer-deps'
          # Optional: arguments passed to `npm run build`
          build-args: ''
          # Optional: the directory after build process to deploy (defaults to `dist/analog/public`)
          deploy-dir: 'dist/analog/public'
          # Optional: a specific branch where the static site should be deployed (defaults to `gh-pages`)
          deploy-branch: 'gh-pages' # important: --dry-run (see option below) won't actually deploy the site!
          # Optional: prevent an actual deployment (e. g. for running in branch pipelines)
          dry-run: true
```

## Options (`with`)

> To deploy, you need to provide a [personal
> `access-token`][github-access-token]. This token must be configured as a
> [Repository Secret][github-repo-secret].

<!-- START: table generated from actions.yml -->

| input           | required | default              | description                                                                                                           |
| --------------- | -------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| package-manager | `false`  | `npm`                | The package manager to be used (`npm`, `yarn`, `pnpm`).                                                               |
| access-token    | `true`   | -                    | A personal access token needed to deploy your site after it has been built.                                           |
| install-args    | `false`  | -                    | Additional arguments that get passed to the install command of the used package manager (e. g. `--legacy-peer-deps`). |
| build-args      | `false`  | -                    | Additional arguments that get passed to `build` script of your `package.json` file.                                   |
| deploy-dir      | `false`  | `dist/analog/public` | The path to the directory to deploy.                                                                                  |
| deploy-branch   | `false`  | `gh-pages`           | The branch where the static site should be deployed.                                                                  |
| dry-run         | `false`  | `false`              | Don't actually deploy if truthy.                                                                                      |

<!-- END: table generated from actions.yml -->

## Assumptions

### Build command

The `build` script of your `package.json` is executed by this action. Additional
arguments can be passed by setting `build-args`.

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

AnalogJS creates files starting with an underscore (`_`) during the build
process. By default GitHub Pages assumes a Jekyll project is being published.
This assumption comes with the fact, all files starting with `_` are being
ignored. To fix this, the actions adds a `.nojekyll` file to the destination
directory and places it in the root on the `gh-pages` branch.

[github-access-token]:
  https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line
[github-pages-domain-docs]:
  https://help.github.com/en/articles/using-a-custom-domain-with-github-pages
[github-repo-secret]:
  https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets
