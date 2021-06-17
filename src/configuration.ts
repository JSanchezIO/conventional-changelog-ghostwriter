/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import { sync as findUpSync } from 'find-up';
import { readFileSync } from 'fs';

type OptionalConfigProps = Pick<Partial<Ghostwriter.Models.Configuration>, 'issueReferencesPrefix'>;

type RequiredConfigProps = Pick<Ghostwriter.Models.Configuration, 'types'>;

type NonPresetConfig = { preset: undefined } & Ghostwriter.Models.Configuration &
  OptionalConfigProps;

type PresetConfig = { preset: 'github' } & RequiredConfigProps & OptionalConfigProps;

const SUPPORTED_FILES = ['.changelogrc.js', '.changelogrc.json', '.changelogrc'];

let cachedConfig: Ghostwriter.Models.Configuration;

export const getConfiguration = (
  context: ConventionalChangelog.API.Context
): Ghostwriter.Models.Configuration => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = findUpSync(SUPPORTED_FILES);

  if (!configPath) {
    throw new Error(
      `You must provide one of the configuration files: ${SUPPORTED_FILES.join(', ')}`
    );
  }

  const config: NonPresetConfig | PresetConfig = configPath.endsWith('.js')
    ? require(configPath)
    : JSON.parse(readFileSync(configPath).toString());

  if (!config.types?.length) {
    throw new Error('You must provide types');
  }

  if (!config.issueReferencesPrefix) {
    config.issueReferencesPrefix = 'for';
  }

  if (config.preset === 'github') {
    cachedConfig = {
      commitUrlFormat: `${context.host}/${context.owner}/${context.repository}/commit/{{LONG_HASH}}`,
      compareUrlFormat: `${context.host}/${context.owner}/${context.repository}/compare/{{PREVIOUS_TAG}}...{{CURRENT_TAG}}`,
      issuePrefixes: ['#'],
      issueReferencesPrefix: config.issueReferencesPrefix,
      issueUrlFormat: `${context.host}/${context.owner}/${context.repository}/issues/{{ISSUE_NUMBER}}`,
      types: config.types,
    };

    return cachedConfig;
  }

  if (!config.commitUrlFormat) {
    throw new Error('You must provide a commitUrlFormat');
  }

  if (!config.compareUrlFormat) {
    throw new Error('You must provide a compareUrlFormat');
  }

  if (!config.issuePrefixes?.length) {
    throw new Error('You must provide issuePrefixes');
  }

  config.issuePrefixes = config.issuePrefixes.map((issuePrefix) => {
    const sanitizedIssuePrefix = issuePrefix.trim();

    if (!sanitizedIssuePrefix) {
      throw new Error('You provided an empty issue prefix');
    }

    return sanitizedIssuePrefix;
  });

  if (!config.issueUrlFormat) {
    throw new Error('You must provide a issueUrlFormat');
  }

  cachedConfig = config;

  return cachedConfig;
};
