import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FetchNotionDataUseCase } from 'src/application/use-cases/fetch-notion-data.use-case';
import { NotionController } from 'src/interface/rest/controllers/notion.controller';
import { WebhooksController } from 'src/interface/rest/controllers/webhooks.controller';
import { SendInteractiveMessageUseCase } from 'src/application/use-cases/send-interactive-message.use-case';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NotionController, WebhooksController],
  providers: [FetchNotionDataUseCase, SendInteractiveMessageUseCase],
})
export class AppModule {}
