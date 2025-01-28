import { Schema } from 'redis-om';

export const namespace: string = 'idn-remote';
export const schemaName: string = `${namespace}:JobEntity`;

export const JobSchema = new Schema(
  schemaName,
  {
    id: { type: 'string' },
    title: { type: 'text' }, // Enables full-text search on title
    description: { type: 'text' }, // Enables full-text search on description
    company: { type: 'text' },
    country: { type: 'text' },
    tags: { type: 'text' },
    url: { type: 'text' },
  },
  {
    dataStructure: 'JSON', // Store as JSON documents
  },
);
