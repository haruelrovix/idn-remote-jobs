import { Injectable } from '@nestjs/common';
import { InteractiveMessageData, ListMessageDto } from 'src/domain/interfaces/interactive-message.interface';
import { SembojaConfig } from 'src/infrastructure/configuration/semboja.config';

@Injectable()
export class SendInteractiveMessageUseCase {
  async execute(requestBody: InteractiveMessageData): Promise<any> {
    try {
      const { message } = requestBody;

      const response = await fetch(SembojaConfig.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SembojaConfig.API_KEY,
        },
        body: JSON.stringify({
          to: message.to,
          type: message.type,
          body: message.body,
          action: message.action,
          header: message.header,
          footer: message.footer,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return { success: true, ...data };
    } catch (error) {
      console.info(error);
      return { success: false };
    }
  }
}
