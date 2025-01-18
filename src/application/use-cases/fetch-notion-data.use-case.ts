import { Injectable } from '@nestjs/common';
import { NotionQueryResponse } from 'src/domain/interfaces/notion-block.interface';

@Injectable()
export class FetchNotionDataUseCase {
  private readonly API_URL = 'https://idn-remote-jobs.notion.site/api/v3/queryCollection';

  async execute(requestBody: any): Promise<void> {
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
    for (const blockId in blocks) {
      const block = blocks[blockId].value;
      const title = block.properties?.title?.[0]?.[0] || 'Untitled';
      const description = block.properties?.dWBj?.[0]?.[0] || 'No description';
      const tags = block.properties?.['L{b{']?.[0]?.[0] || 'No tags';
      const url = block.properties?.['=a>r']?.[0]?.[0] || 'No URL';
      console.log(`Job: ${title}`);
      console.log(`Description: ${description}`);
      console.log(`Tags: ${tags}`);
      console.log(`URL: ${url}`);
      console.log('-------------------------');
    }
  }
}
