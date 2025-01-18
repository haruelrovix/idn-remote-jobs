import { Injectable } from '@nestjs/common';
import { NotionQueryResponse } from 'src/domain/interfaces/notion-block.interface';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';

export interface JobData {
  id: string;
  title: string;
  company: string;
  description: string;
  country?: string;
  tags?: string;
  url?: string;
}

@Injectable()
export class FetchNotionDataUseCase {
  async execute(requestBody: any): Promise<JobData[]> {
    const url = `${NotionConfig.API_URL}/${NotionConfig.QUERY_COLLECTION_ENDPOINT}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: NotionQueryResponse = await response.json();

    const blocks = data.recordMap.block;
    const jobsData: JobData[] = [];
    const { JOB_TITLE, JOB_DESCRIPTION, TAGS, JOB_URL, JOB_COUNTRY, COMPANY } =
      NotionConfig.DATA_MAPPING;

    for (const blockId in blocks) {
      const { properties: it, id } = blocks[blockId].value;
      const title = it?.[JOB_TITLE]?.[0]?.[0] || 'Untitled';

      // Only add jobs with a non-'Untitled' title
      if (title !== 'Untitled') {
        const description = it?.[JOB_DESCRIPTION]?.[0]?.[0] || 'No description';
        const tags = it?.[TAGS]?.[0]?.[0] || 'No tags';
        const url = it?.[JOB_URL]?.[0]?.[0] || 'No URL';
        const country = it?.[JOB_COUNTRY]?.[0]?.[0] || 'Unknown';
        const company = it?.[COMPANY]?.[0]?.[0] || 'Unknown';

        jobsData.push({
          id,
          title,
          company,
          description,
          country,
          tags,
          url,
        });
      }
    }

    return jobsData;
  }
}
