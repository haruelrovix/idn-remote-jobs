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
    for (const blockId in blocks) {
      const block = blocks[blockId].value;
      const title = block.properties?.title?.[0]?.[0] || 'Untitled';

      // Only add jobs with a non-'Untitled' title
      if (title !== 'Untitled') {
        const description =
          block.properties?.dWBj?.[0]?.[0] || 'No description';
        const tags = block.properties?.['L{b{']?.[0]?.[0] || 'No tags';
        const url = block.properties?.['=a>r']?.[0]?.[0] || 'No URL';
        const country = block.properties?.['~yj~']?.[0]?.[0] || 'Unknown';
        const company = block.properties?.['ICod']?.[0]?.[0] || 'Unknown';

        jobsData.push({
          id: block.id,
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
