/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import compareFunc from 'compare-func';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getConfiguration } from './configuration';

let nonNativeIssuePrefixes: Array<{
  issuePrefix: string;
  regExp: RegExp;
}> = [];
export default {
  commitGroupsSort: 'title',
  commitPartial: readFileSync(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
  commitsSort: ['scope', 'subject'],
  footerPartial: readFileSync(resolve(__dirname, './templates/footer.hbs'), 'utf-8'),
  groupBy: 'type',
  headerPartial: readFileSync(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
  mainTemplate: readFileSync(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
  noteGroupsSort: 'title',
  notesSort: compareFunc,
  transform: (
    commit: ConventionalChangelog.API.Commit,
    context: Ghostwriter.Models.Context
  ): Ghostwriter.Models.Commit | undefined => {
    if (!context.config) {
      context.config = getConfiguration(context);

      if (context.previousTag) {
        context.config.compareUrlFormat = context.config.compareUrlFormat
          .replace('{{PREVIOUS_TAG}}', context.previousTag)
          .replace('{{CURRENT_TAG}}', context.currentTag);
      }

      nonNativeIssuePrefixes = context.config.issuePrefixes
        .filter((issuePrefix) => issuePrefix !== '#')
        .map((issuePrefix) => {
          return {
            issuePrefix,
            regExp: new RegExp(`${issuePrefix}(\\S+)`),
          };
        });
    }

    const { config } = context;
    const uniqueReferences = new Set<string>();
    const references: Ghostwriter.Models.Commit['references'] = [];

    commit.references?.forEach((reference) => {
      const referenceKey = `${reference.prefix}${reference.issue}`;

      if (uniqueReferences.has(referenceKey)) {
        return;
      }

      let { issue, prefix } = reference;

      const matchingNonNativeIssuePrefix = nonNativeIssuePrefixes.find(({ regExp }) =>
        regExp.test(issue)
      );

      if (matchingNonNativeIssuePrefix) {
        const matchingIssue = matchingNonNativeIssuePrefix.regExp.exec(issue);

        if (matchingIssue?.length) {
          [, issue] = matchingIssue;
          prefix = matchingNonNativeIssuePrefix.issuePrefix;
        }
      }

      references.push({
        issue,
        issueUrl: config.issueUrlFormat
          .replace('{{ISSUE_PREFIX}}', prefix)
          .replace('{{ISSUE_NUMBER}}', issue),
        prefix,
      });

      uniqueReferences.add(referenceKey);
    });

    const result: Ghostwriter.Models.Commit = {
      commitUrl: config.commitUrlFormat
        .replace('{{LONG_HASH}}', commit.commit.long)
        .replace('{{SHORT_HASH}}', commit.commit.short),
      hash: commit.commit,
      notes: commit.notes.map((note) => {
        return {
          text: note.text.replace(new RegExp(config.issuePrefixes[1], 'g'), '').trim(),
          title: 'BREAKING CHANGES',
        };
      }),
      references,
      scope: commit.scope === '*' ? null : commit.scope,
      subject: commit.subject,
      type: commit.type,
    };

    const supportedType = config.types.find(({ type }) => type === result.type);

    if (result.notes.length === 0 && (!supportedType || supportedType.hidden)) {
      return undefined;
    }

    result.type = supportedType?.section ?? result.type;

    return result;
  },
};
