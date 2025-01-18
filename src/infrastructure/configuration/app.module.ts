import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FetchNotionDataUseCase } from 'src/application/use-cases/fetch-notion-data.use-case';
import { NotionController } from 'src/interface/rest/controllers/notion.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NotionController],
  providers: [FetchNotionDataUseCase],
})
export class AppModule {}
