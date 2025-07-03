import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseQuery } from '../../../../../core/common/application/queries/base-query.interface';
import { AssignorDto } from '@bankme/shared';

export interface GetAllAssignorsQueryInput {}

export interface GetAllAssignorsQueryOutput {
  assignors: AssignorDto[];
  total: number;
}

export class GetAllAssignorsQuery
  implements BaseQuery<GetAllAssignorsQueryInput, GetAllAssignorsQueryOutput>
{
  constructor(
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(): Promise<GetAllAssignorsQueryOutput> {
    return this.applicationService.execute(async () => {
      const assignors = await this.assignorRepository.findAll();

      return {
        assignors: assignors.map((assignor) => assignor.toDto()),
        total: assignors.length,
      };
    });
  }
}
