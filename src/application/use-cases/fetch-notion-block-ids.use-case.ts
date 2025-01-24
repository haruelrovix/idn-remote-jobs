import { Injectable } from '@nestjs/common';
import { NotionQueryResponse } from 'src/domain/interfaces/notion-block.interface';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';

@Injectable()
export class FetchNotionBlockIdsUseCase {
  async execute(requestBody: any): Promise<string[]> {
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

    return data?.allBlockIds || [];
  }
}
