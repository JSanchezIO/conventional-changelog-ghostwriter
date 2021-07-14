/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import compareFunc from 'compare-func';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getConfiguration } from './configuration';

let issuePrefixes: Array<{
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

      if (context.currentTag && context.previousTag) {
        context.config.compareUrlFormat = context.config.compareUrlFormat
          .replace('{{PREVIOUS_TAG}}', context.previousTag)
          .replace('{{CURRENT_TAG}}', context.currentTag);
      }

      if (context.gitSemverTags?.length) {
        const currentTag = `${context.packageData.name}@${context.packageData.version}`;
        const [previousTag] = context.gitSemverTags;

        if (previousTag) {
          context.config.compareUrlFormat = context.config.compareUrlFormat
            .replace('{{PREVIOUS_TAG}}', previousTag)
            .replace('{{CURRENT_TAG}}', currentTag);
        }
      }

      issuePrefixes = context.config.issuePrefixes.map((issuePrefix) => {
        return {
          issuePrefix,
          regExp: new RegExp(`#${issuePrefix}(\\S+)`, 'g'),
        };
      });
    }

    const { config } = context;
    const uniqueReferences = new Set<string>();
    const references: Ghostwriter.Models.Commit['references'] = [];

    if (commit.footer?.length) {
      const { footer } = commit;

      issuePrefixes.forEach(({ issuePrefix, regExp }) => {
        const issues = Array.from(footer.matchAll(regExp), (matches) => matches[1]);

        issues.forEach((issue) => {
          const referenceKey = `${issuePrefix}${issue}`;

          if (uniqueReferences.has(referenceKey)) {
            return;
          }

          references.push({
            issue,
            issueUrl: config.issueUrlFormat
              .replace('{{ISSUE_PREFIX}}', issuePrefix)
              .replace('{{ISSUE_NUMBER}}', issue),
            prefix: issuePrefix,
          });

          uniqueReferences.add(referenceKey);
        });
      });
    }

    const hash =
      commit.commit !== undefined
        ? commit.commit
        : {
            long: commit.hash,
            short: commit.hash.substr(0, 7),
          };

    const result: Ghostwriter.Models.Commit = {
      commitUrl: config.commitUrlFormat
        .replace('{{LONG_HASH}}', hash.long)
        .replace('{{SHORT_HASH}}', hash.short),
      hash,
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
