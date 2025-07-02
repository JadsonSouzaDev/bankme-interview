import { BadRequestException } from '@nestjs/common';
import { Assignor } from '../../../domain/assignor.aggregate';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';
import { AssignorDto } from '@bankme/shared';

export interface CreateAssignorCommandInput {
  name: string;
  email: string;
  document: string;
  phone: string;
}

export class CreateAssignorCommand
  implements BaseCommand<CreateAssignorCommandInput, AssignorDto>
{
  constructor(
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(dto: CreateAssignorCommandInput): Promise<AssignorDto> {
    return this.applicationService.execute(async () => {
      const existingAssignorByEmail = await this.assignorRepository.findByEmail(
        dto.email,
      );
      if (existingAssignorByEmail) {
        throw new BadRequestException('Email already in use');
      }

      const existingAssignorByDocument =
        await this.assignorRepository.findByDocument(dto.document);
      if (existingAssignorByDocument) {
        throw new BadRequestException('Document already in use');
      }

      const assignor = Assignor.create({
        name: dto.name,
        email: dto.email,
        document: dto.document,
        phone: dto.phone,
      });

      const savedAssignor = await this.assignorRepository.save(assignor);
      return savedAssignor.toDto();
    });
  }
}
