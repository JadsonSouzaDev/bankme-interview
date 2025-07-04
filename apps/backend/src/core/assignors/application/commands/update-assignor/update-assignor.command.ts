import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';
import { AssignorDto } from '@bankme/shared';

export interface UpdateAssignorCommandInput {
  id: string;
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
}

export class UpdateAssignorCommand
  implements BaseCommand<UpdateAssignorCommandInput, AssignorDto>
{
  constructor(
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(dto: UpdateAssignorCommandInput): Promise<AssignorDto> {
    return this.applicationService.execute(async () => {
      const { id, ...updateData } = dto;

      const assignor = await this.assignorRepository.findById(id);

      if (!assignor) {
        throw new NotFoundException('Assignor not found');
      }

      if (updateData.email && updateData.email !== assignor.email) {
        const existingAssignorByEmail =
          await this.assignorRepository.findByEmail(updateData.email);
        if (existingAssignorByEmail && existingAssignorByEmail.id !== id) {
          throw new BadRequestException('Email already exists');
        }
      }

      if (updateData.document && updateData.document !== assignor.document) {
        const existingAssignorByDocument =
          await this.assignorRepository.findByDocument(updateData.document);
        if (
          existingAssignorByDocument &&
          existingAssignorByDocument.id !== id
        ) {
          throw new BadRequestException('Document already exists');
        }
      }

      assignor.updateMultipleFields(updateData);
      const updatedAssignor = await this.assignorRepository.save(assignor);
      return updatedAssignor.toDto();
    });
  }
}
