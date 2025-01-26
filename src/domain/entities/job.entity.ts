export class JobEntity {
  constructor(partial: Partial<JobEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  title: string;
  company: string;
  description: string;
  country: string;
  tags: string;
  url: string;
}

export enum JobField {
  COMPANY = 'company',
  COUNTRY = 'country',
  DESCRIPTION = 'description',
  TITLE = 'title',
  TAGS = 'tags',
}

export enum JobUniqueField {
  COMPANY = 'company',
  COUNTRY = 'country',
}

export type JobsType = JobEntity[] | PromiseLike<JobEntity[]>;
export type JobUniqueResponse = { [x: string]: string[] };
