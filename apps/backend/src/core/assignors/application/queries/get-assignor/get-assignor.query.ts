import { NotFoundException } from '@nestjs/common';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseQuery } from '../../../../../core/common/application/queries/base-query.interface';
import { AssignorDto } from '@bankme/shared';

export interface GetAssignorQueryInput {
  id: string;
}

export class GetAssignorQuery
  implements BaseQuery<GetAssignorQueryInput, AssignorDto>
{
  constructor(
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(input: GetAssignorQueryInput): Promise<AssignorDto> {
    return this.applicationService.execute(async () => {
      const assignor = await this.assignorRepository.findById(input.id);
      if (!assignor) {
        throw new NotFoundException('Assignor não encontrado');
      }

      return assignor.toDto();
    });
  }
}
