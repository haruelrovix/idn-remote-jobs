import { Injectable } from '@nestjs/common';
import { NotionQueryResponse } from 'src/domain/interfaces/notion-block.interface';

export interface JobData {
  title: string;
  description: string;
  tags: string;
  url: string;
}

@Injectable()
export class FetchNotionDataUseCase {
  private readonly API_URL = 'https://idn-remote-jobs.notion.site/api/v3/queryCollection';

  async execute(requestBody: any): Promise<JobData[]> {
    const response = await fetch(this.API_URL, {
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
        const description = block.properties?.dWBj?.[0]?.[0] || 'No description';
        const tags = block.properties?.['L{b{']?.[0]?.[0] || 'No tags';
        const url = block.properties?.['=a>r']?.[0]?.[0] || 'No URL';

        jobsData.push({
          title,
          description,
          tags,
          url
        });
      }
    }

    return jobsData;
  }
}
