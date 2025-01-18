import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey = process.env.GOSHAWK_API_KEY;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.header('x-api-key');

    if (!key) {
      throw new UnauthorizedException('API key is missing');
    }

    if (![this.apiKey].includes(key)) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
