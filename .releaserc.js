module.exports = {
  branches: ['main'],
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
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    '@semantic-release/github',
  ],
  repositoryUrl: 'https://github.com/JSanchezIO/conventional-changelog-ghostwriter.git',
};
