import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FetchNotionDataUseCase } from 'src/application/use-cases/fetch-notion-data.use-case';
import { NotionController } from 'src/interface/rest/controllers/notion.controller';
import { WebhooksController } from 'src/interface/rest/controllers/webhooks.controller';
import { SendInteractiveMessageUseCase } from 'src/application/use-cases/send-interactive-message.use-case';
import { FetchNotionPageUseCase } from 'src/application/use-cases/fetch-notion-page.use-case';
import { FetchNotionBlockIdsUseCase } from '@application/use-cases/fetch-notion-block-ids.use-case';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NotionController, WebhooksController],
  providers: [
    FetchNotionBlockIdsUseCase,
    FetchNotionDataUseCase,
    FetchNotionPageUseCase,
    SendInteractiveMessageUseCase,
  ],
})
export class AppModule {}
