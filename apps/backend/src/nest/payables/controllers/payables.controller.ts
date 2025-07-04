import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Inject,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreatePayableBatchDto,
  CreatePayableDto,
  PayableBatchDto,
  PayableDto,
  UpdatePayableDto,
} from '@bankme/shared';

import { CreatePayableCommand } from '../../../core/payables/application/commands/create-payable/create-payable.command';
import { GetPayableQuery } from '../../../core/payables/application/queries/get-payable/get-payable.query';
import { GetAllPayablesQuery } from '../../../core/payables/application/queries/get-all-payables/get-all-payables.query';
import { UpdatePayableCommand } from '../../../core/payables/application/commands/update-payable/update-payable.command';
import { DeletePayableCommand } from '../../../core/payables/application/commands/delete-payable/delete-payable.command';
import { CreatePayablesBatchCommand } from '../../../core/payables/application/commands/create-payables-batch/create-payables-batch.command';
import {
  CREATE_PAYABLE_COMMAND,
  GET_ALL_PAYABLES_QUERY,
  GET_PAYABLE_QUERY,
  UPDATE_PAYABLE_COMMAND,
  DELETE_PAYABLE_COMMAND,
  CREATE_PAYABLES_BATCH_COMMAND,
} from '../payables.providers';

@ApiTags('payables')
@ApiBearerAuth('JWT-auth')
@Controller('integrations/payable')
export class PayablesIntegrationController {
  constructor(
    @Inject(CREATE_PAYABLE_COMMAND)
    private readonly createPayableCommand: CreatePayableCommand,

    @Inject(CREATE_PAYABLES_BATCH_COMMAND)
    private readonly createPayablesBatchCommand: CreatePayablesBatchCommand,

    @Inject(GET_PAYABLE_QUERY)
    private readonly getPayableQuery: GetPayableQuery,

    @Inject(GET_ALL_PAYABLES_QUERY)
    private readonly getAllPayablesQuery: GetAllPayablesQuery,

    @Inject(UPDATE_PAYABLE_COMMAND)
    private readonly updatePayableCommand: UpdatePayableCommand,

    @Inject(DELETE_PAYABLE_COMMAND)
    private readonly deletePayableCommand: DeletePayableCommand,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create payable',
    description: 'Creates a new payable',
  })
  @ApiBody({
    type: CreatePayableDto,
    description: 'Data for creating the payable',
  })
  @ApiResponse({
    status: 201,
    description: 'Payable created successfully',
    type: PayableDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async createPayable(@Body() dto: CreatePayableDto): Promise<PayableDto> {
    return await this.createPayableCommand.execute({
      ...dto,
      emissionDate: new Date(dto.emissionDate),
    });
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create payables in batch',
    description: 'Creates multiple payables in a single operation',
  })
  @ApiBody({
    type: CreatePayableBatchDto,
    description: 'Data for creating the payables',
  })
  @ApiResponse({
    status: 201,
    description: 'Payables created successfully',
    type: PayableBatchDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async createPayablesBatch(
    @Body() dto: CreatePayableBatchDto,
  ): Promise<PayableBatchDto> {
    const payables = dto.payables.map((item) => ({
      ...item,
      emissionDate: new Date(item.emissionDate),
    }));

    return this.createPayablesBatchCommand.execute({ payables });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List payables',
    description: 'Returns all payables with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payables returned successfully',
    schema: {
      type: 'object',
      properties: {
        payables: {
          type: 'array',
          items: { $ref: '#/components/schemas/PayableDto' },
        },
        total: {
          type: 'number',
          description: 'Total of payables',
        },
      },
    },
  })
  async getAllPayables(): Promise<{
    payables: PayableDto[];
    total: number;
  }> {
    return await this.getAllPayablesQuery.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get payable by ID',
    description: 'Returns a specific payable by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payable ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Payable found successfully',
    type: PayableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payable not found',
  })
  async getPayable(@Param('id') id: string): Promise<PayableDto> {
    return await this.getPayableQuery.execute({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update payable',
    description: 'Updates the data of an existing payable',
  })
  @ApiParam({
    name: 'id',
    description: 'Payable ID',
    type: 'string',
  })
  @ApiBody({
    type: UpdatePayableDto,
    description: 'Data for updating the payable',
  })
  @ApiResponse({
    status: 200,
    description: 'Payable updated successfully',
    type: PayableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payable not found',
  })
  async updatePayable(
    @Param('id') id: string,
    @Body() dto: UpdatePayableDto,
  ): Promise<PayableDto> {
    return await this.updatePayableCommand.execute({
      id,
      ...dto,
      emissionDate: dto.emissionDate ? new Date(dto.emissionDate) : undefined,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete payable',
    description: 'Removes a payable by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payable ID',
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Payable deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payable not found',
  })
  async deletePayable(@Param('id') id: string): Promise<void> {
    await this.deletePayableCommand.execute({ id });
  }
}
