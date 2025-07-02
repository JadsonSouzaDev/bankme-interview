import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Inject,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  AssignorDto,
  CreateAssignorDto,
  UpdateAssignorDto,
} from '@bankme/shared';
import { CreateAssignorCommand } from '../../../core/assignors/application/commands/create-assignor/create-assignor.command';
import { DeleteAssignorCommand } from '../../../core/assignors/application/commands/delete-assignor/delete-assignor.command';
import { UpdateAssignorCommand } from '../../../core/assignors/application/commands/update-assignor/update-assignor.command';
import { GetAssignorQuery } from '../../../core/assignors/application/queries/get-assignor/get-assignor.query';
import { GetAllAssignorsQuery } from '../../../core/assignors/application/queries/get-all-assignors/get-all-assignors.query';
import {
  CREATE_ASSIGNOR_COMMAND,
  DELETE_ASSIGNOR_COMMAND,
  UPDATE_ASSIGNOR_COMMAND,
  GET_ASSIGNOR_QUERY,
  GET_ALL_ASSIGNORS_QUERY,
} from '../assignors.providers';

@Controller('integrations/assignor')
export class AssignorsIntegrationController {
  constructor(
    @Inject(CREATE_ASSIGNOR_COMMAND)
    private readonly createAssignorCommand: CreateAssignorCommand,

    @Inject(DELETE_ASSIGNOR_COMMAND)
    private readonly deleteAssignorCommand: DeleteAssignorCommand,

    @Inject(UPDATE_ASSIGNOR_COMMAND)
    private readonly updateAssignorCommand: UpdateAssignorCommand,

    @Inject(GET_ASSIGNOR_QUERY)
    private readonly getAssignorQuery: GetAssignorQuery,

    @Inject(GET_ALL_ASSIGNORS_QUERY)
    private readonly getAllAssignorsQuery: GetAllAssignorsQuery,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAssignor(@Body() dto: CreateAssignorDto): Promise<AssignorDto> {
    return await this.createAssignorCommand.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAssignors() {
    return await this.getAllAssignorsQuery.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAssignor(@Param('id') id: string): Promise<AssignorDto> {
    return await this.getAssignorQuery.execute({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateAssignor(
    @Param('id') id: string,
    @Body() dto: UpdateAssignorDto,
  ): Promise<AssignorDto> {
    return await this.updateAssignorCommand.execute({ id, ...dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAssignor(@Param('id') id: string) {
    await this.deleteAssignorCommand.execute({ id });
  }
}
