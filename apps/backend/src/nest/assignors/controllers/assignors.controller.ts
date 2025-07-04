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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

@ApiTags('assignors')
@ApiBearerAuth('JWT-auth')
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
  @ApiOperation({
    summary: 'Create assignor',
    description: 'Creates a new assignor',
  })
  @ApiBody({
    type: CreateAssignorDto,
    description: 'Data for creating the assignor',
  })
  @ApiResponse({
    status: 201,
    description: 'Assignor created successfully',
    type: AssignorDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async createAssignor(@Body() dto: CreateAssignorDto): Promise<AssignorDto> {
    return await this.createAssignorCommand.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List assignors',
    description: 'Returns all assignors',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assignors returned successfully',
    type: [AssignorDto],
  })
  async getAllAssignors() {
    return await this.getAllAssignorsQuery.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get assignor by ID',
    description: 'Returns a specific assignor by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignor ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignor found successfully',
    type: AssignorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Assignor not found',
  })
  async getAssignor(@Param('id') id: string): Promise<AssignorDto> {
    return await this.getAssignorQuery.execute({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update assignor',
    description: 'Updates the data of an existing assignor',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignor ID',
    type: 'string',
  })
  @ApiBody({
    type: UpdateAssignorDto,
    description: 'Data for updating the assignor',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignor updated successfully',
    type: AssignorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Assignor not found',
  })
  async updateAssignor(
    @Param('id') id: string,
    @Body() dto: UpdateAssignorDto,
  ): Promise<AssignorDto> {
    return await this.updateAssignorCommand.execute({ id, ...dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete assignor',
    description: 'Removes an assignor by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignor ID',
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Assignor deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignor not found',
  })
  async deleteAssignor(@Param('id') id: string) {
    await this.deleteAssignorCommand.execute({ id });
  }
}
