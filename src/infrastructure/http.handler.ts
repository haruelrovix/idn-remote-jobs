import { Callback, Context, Handler } from 'aws-lambda';
import { createHttpHandler } from './http.bootstrap';
import { AppModule } from './modules/app.module';

let server: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!server) {
    server = await createHttpHandler(AppModule);
  }

  if (event.body) {
    console.info(event.body);
  }

  if (event.queryStringParameters) {
    console.info(event.queryStringParameters);
  }

  return server(event, context, callback);
};
