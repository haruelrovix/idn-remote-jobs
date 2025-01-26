import { SectionDto } from '@domain/interfaces/interactive-message.interface';
import { NotionConfig } from '@infrastructure/configuration/notion.config';

export const truncateText = (
  text: string,
  maxLength: number = 24,
  ellipsis: string = '...',
): string => {
  return text.length > maxLength
    ? text.substring(0, maxLength - ellipsis.length) + ellipsis
    : text;
};

export const groupByCompany = <T extends { company: string }>(
  jobs: T[],
): Record<string, T[]> => {
  return jobs.reduce(
    (acc, job) => {
      const company = job.company;
      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(job);
      return acc;
    },
    {} as Record<string, T[]>,
  );
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const buildInteractiveMessage = (
  to: string,
  body: string,
  sections: SectionDto[],
  footer: string,
) => ({
  message: {
    to,
    type: 'list',
    header: {
      type: 'text',
      text: NotionConfig.LIST_MESSAGE_OPTIONS.header,
    },
    body: { text: body },
    action: {
      button: NotionConfig.LIST_MESSAGE_OPTIONS.actionButton,
      sections,
    },
    footer: { text: footer },
  },
});
