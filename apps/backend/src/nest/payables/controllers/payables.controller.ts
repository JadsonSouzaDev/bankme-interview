import { Controller, Post, Body } from '@nestjs/common';
import { CreatePayableDto } from '@bankme/shared';

@Controller('integrations/payable')
export class PayablesIntegrationController {
  @Post()
  createPayable(@Body() body: CreatePayableDto): CreatePayableDto {
    return body;
  }
}
