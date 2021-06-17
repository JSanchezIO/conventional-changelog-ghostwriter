module.exports = {
  preset: 'github',
  types: [
    {
      description: 'A new feature',
      section: 'Features',
      type: 'feat',
    },
    {
      description: 'A bug fix',
      section: 'Fixes',
      type: 'fix',
    },
    {
      description: "A commit that modifies code but doesn't fix a bug or add a feature",
      hidden: true,
      type: 'refactor',
    },
  ],
};
