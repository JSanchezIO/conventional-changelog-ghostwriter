declare namespace ConventionalChangelog {
  namespace API {
    type Commit = {
      author: {
        name: string;
        email: string;
        date: Date;
      };
      body: string | null;
      committer: {
        name: string;
        email: string;
        date: Date;
      };
      commit?: {
        long: string;
        short: string;
      };
      committerDate: Date;
      footer: string | null;
      gitTags: string;
      hash: string;
      header: string;
      mentions: unknown[];
      merge: string | null;
      message: string;
      notes: CommitNote[];
      references?: CommitReference[];
      revert: boolean | null;
      scope: string | null;
      subject: string;
      tree: {
        long: string;
        short: string;
      };
      type: string;
    };

    type CommitNote = {
      text: string;
      title: string;
    };

    type CommitReference = {
      action: unknown | null;
      issue: string;
      owner: unknown | null;
      prefix: string;
      raw: string;
      repository: unknown | null;
    };

    type Configuration = {
      /** The URL template to use when generating links to a specific commit hash. */
      commitUrlFormat?: string;

      /** The URL template to use when generating links to a comparison between two git shas.  */
      compareUrlFormat?: string;

      /** A string to be used as the main header of the CHANGELOG. */
      header?: string;

      /** The array of prefixes used to detect references to issues. */
      issuePrefixes?: string[];

      /** The URL template to use when generating links to an issue, e.g., GitHub, JIRA, Trello. */
      issueUrlFormat?: string;

      /** The array of type objects representing the explicitly supported commit message types, and whether they should show up in generated CHANGELOGs. */
      types: Array<
        {
          type: string;
        } & ({ hidden?: undefined; section: string } | { hidden: true; section?: undefined })
      >;

      /** The URL template to use when generating links to a user's profile, e.g., GitHub. */
      userUrlFormat?: string;
    };

    type Context = {
      /** The host of the repository. */
      host: string;

      /** The owner of the repository. */
      owner: string;

      /** The name of the repository. */
      repository: string;
    } & (
      | {
          /** The current releases' tag. */
          currentTag: string;

          /** The previsous release's tag, if any. */
          previousTag?: string;

          gitSemverTags?: undefined;

          packageData?: undefined;
        }
      | {
          currentTag?: undefined;

          previousTag?: undefined;

          /** An array of existing tags sorted by most recent. */
          gitSemverTags?: string[];

          /** The corresponding package.json */
          packageData: {
            /** The name of the package. */
            name: string;

            /** The new version of the package. */
            version: string;
          };
        }
    );
  }
}
