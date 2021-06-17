declare namespace Ghostwriter {
  namespace Models {
    type Configuration = {
      /** The URL template to use when generating links to a specific commit hash. */
      commitUrlFormat: string;

      /** The URL template to use when generating links to a comparison between two git shas. */
      compareUrlFormat: string;

      /** The array of prefixes used to detect references to issues. */
      issuePrefixes: string[];

      /** The prefix to use before listing issues that a commit refers to. Defaults to `"for"`. */
      issueReferencesPrefix: string;

      /** The configuration preset to use which will set other configuration properties. */
      issueUrlFormat: string;

      /**
       * The array of type objects representing the explicitly supported commit message
       * types, and whether they should show up in generated CHANGELOGs.
       */
      types: Array<HiddenType | VisibleType>;
    };

    type Context = ConventionalChangelog.API.Context & {
      config?: Ghostwriter.Models.Configuration;
    };

    type Commit = {
      commitUrl: string;
      hash: {
        long: string;
        short: string;
      };
      notes: ConventionalChangelog.API.CommitNote[];
      references: Array<{
        issue: string;
        issueUrl: string;
        prefix: string;
      }>;
      scope: string | null;
      subject: string;
      type: string;
    };

    type CommitType = { description: string; type: string };

    type HiddenType = CommitType & { hidden: true; section: undefined };

    type VisibleType = CommitType & { hidden: undefined; section: string };
  }
}
