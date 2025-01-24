import { Injectable } from '@nestjs/common';
import { NotionQueryResponse } from 'src/domain/interfaces/notion-block.interface';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';

export interface JobDetail {
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
  async execute(
    id: string,
    limit: number = 30,
    verticalColumns: boolean = false,
  ): Promise<JobDetail> {
    const endpoint = `${NotionConfig.API_URL}/${NotionConfig.LOAD_PAGE_ENDPOINT}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: { id },
        limit,
        verticalColumns,
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

    const { properties: it } = block;

    const { JOB_TITLE, JOB_DESCRIPTION, TAGS, JOB_URL, JOB_COUNTRY, COMPANY } =
      NotionConfig.DATA_MAPPING;

    const description = it?.[JOB_DESCRIPTION]?.[0]?.[0] || 'No description';
    const tags = it?.[TAGS]?.[0]?.[0] || 'No tags';
    const url = it?.[JOB_URL]?.[0]?.[0] || 'No URL';
    const country = it?.[JOB_COUNTRY]?.[0]?.[0] || 'Unknown';
    const company = it?.[COMPANY]?.[0]?.[0] || 'Unknown';
    const title = it?.[JOB_TITLE]?.[0]?.[0] || 'No title';

    const jobData: JobDetail = {
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
