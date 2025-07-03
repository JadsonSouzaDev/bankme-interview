import { Controller, Get } from '@nestjs/common';
import { Public } from './nest/common/auth/decorators';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('health')
  getHealth(): string {
    return 'OK';
  }
}
