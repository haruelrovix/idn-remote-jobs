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
