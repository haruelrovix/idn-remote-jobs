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
  createdTime: number;
  lastEditedTime: number;
  parentId: string;
  spaceId: string;
}

@Injectable()
export class FetchNotionPageUseCase {
  async execute(id: string): Promise<JobData> {
    const endpoint = `${NotionConfig.API_URL}/${NotionConfig.LOAD_PAGE_ENDPOINT}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: { id },
        limit: 30,
        verticalColumns: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: NotionQueryResponse = await response.json();

    const block = data.recordMap.block?.[id]?.value;
    if (!block) {
      return null;
    }

    const description = block.properties?.dWBj?.[0]?.[0] || 'No description';
    const tags = block.properties?.['L{b{']?.[0]?.[0] || 'No tags';
    const url = block.properties?.['=a>r']?.[0]?.[0] || 'No URL';
    const country = block.properties?.['~yj~']?.[0]?.[0] || 'Unknown';
    const company = block.properties?.['ICod']?.[0]?.[0] || 'Unknown';
    const title = block.properties?.['title']?.[0]?.[0] || 'No title';

    const jobData: JobData = {
      id,
      title,
      description,
      tags,
      url,
      country,
      company,
      createdTime: block.created_time,
      lastEditedTime: block.last_edited_time,
      parentId: block.parent_id,
      spaceId: block.space_id,
    };

    return jobData;
  }
}
