import { FetchNotionBlockIdsUseCase } from '@application/use-cases/fetch-notion-block-ids.use-case';
import { FetchNotionDataUseCase } from '@application/use-cases/fetch-notion-data.use-case';
import { FetchNotionPageUseCase } from '@application/use-cases/fetch-notion-page.use-case';
import { SendInteractiveMessageUseCase } from '@application/use-cases/send-interactive-message.use-case';
import { NotionController } from '@controllers/notion.controller';
import { WebhooksController } from '@controllers/webhooks.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from '@infrastructure/modules/job.module';

@Module({
  imports: [ConfigModule.forRoot(), JobsModule],
  controllers: [NotionController, WebhooksController],
  providers: [
    FetchNotionBlockIdsUseCase,
    FetchNotionDataUseCase,
    FetchNotionPageUseCase,
    SendInteractiveMessageUseCase,
  ],
})
export class AppModule {}
