import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (apiKey !== 'hospital123') {
            throw new UnauthorizedException('Invalid or missing API Key! Use header x-api-key: hospital123');
        }

        return true;
    }
}