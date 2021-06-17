<h1 align="center">conventional-changelog-ghostwriter</h1>

<div align="center">

[![CI Status](https://github.com/JSanchezIO/conventional-changelog-ghostwriter/workflows/CI/badge.svg)](https://github.com/JSanchezIO/conventional-changelog-ghostwriter/actions/workflows/ci.yml)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![NPM Package Version](https://img.shields.io/npm/v/conventional-changelog-ghostwriter)](https://www.npmjs.com/package/conventional-changelog-ghostwriter)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://semantic-release.gitbook.io/semantic-release/)

</div>

<br />

You want to leverage conventional-changelog to create a `CHANGELOG.md` but none of the available
presets support your commit types or tools, e.g., Bitbucket, JIRA, Trello. This preset supports
configuration via a `.changelogrc.js` file.

<br />

## Installation

```sh
npm i conventional-changelog-ghostwriter
```

<br />

## Usage

1. Create and configure a `.changelogrc.js` file in the root of your repository
2. Update your `CHANGELOG.md` generator to leverage `conventional-changelog-ghostwriter`

   - Semantic Release

     ```js
     module.exports = {
       ...

       plugins: [
         [
           '@semantic-release/commit-analyzer',
           {
             preset: 'ghostwriter',
           },
         ],
         [
           '@semantic-release/release-notes-generator',
           {
             preset: 'ghostwriter',
           },
         ],
       ],

       ...
     };
     ```

3. Generate your `CHANGELOG.md`

<br />

## Configuration

### `commitUrlFormat` : _string_

---

The URL template to use when generating links to a specific commit hash.

| Template Variable | Description                               |
| ----------------- | ----------------------------------------- |
| `{{LONG_HASH}}`   | The fully qualified git commit hash.      |
| `{{SHORT_HASH}}`  | The short version of the git commit hash. |

<br >

### `compareUrlFormat` : _string_

---

The URL template to use when generating links to a comparison between two git shas.

| Template Variable  | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `{{CURRENT_TAG}}`  | The tag of the version the changelog is being generated for. |
| `{{PREVIOUS_TAG}}` | The tag of the last version the changelog was generated for. |

<br >

### `issuePrefixes` : _string[]_

---

The array of prefixes used to detect references to issues.

<br >

### `issueReferencesPrefix` : _string = "for"_

---

The prefix to use before listing issues that a commit refers to. Defaults to `"for"`.

<br >

### `issueUrlFormat` : _string_

---

The URL template to use when generating links to a comparison between two git shas.

| Template Variable  | Description         |
| ------------------ | ------------------- |
| `{{ISSUE_NUMBER}}` | The issue's number. |
| `{{ISSUE_PREFIX}}` | The issue's prefix. |

<br >

### `preset` : _"github" | undefined_

---

The configuration preset to use which will set other configuration properties. If this property is
set the following configuration properties are overwritten, i.e., nullable:

- `commitUrlFormat`
- `compareUrlFormat`
- `issuePrefixes`
- `issueReferencesPrefix`
- `issueUrlFormat`

<br >

### `types` : _Array<HiddenType | VisibleType>_

---

The array of type objects representing the explicitly supported commit message types, and whether
they should show up in generated CHANGELOGs.

```ts
type CommitType = { description: string; type: string };

type HiddenType = CommitType & { hidden: true; section: undefined };

type VisibleType = CommitType & { hidden: undefined; section: string };
```
