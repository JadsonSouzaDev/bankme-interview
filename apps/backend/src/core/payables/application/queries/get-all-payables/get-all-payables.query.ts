import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseQuery } from '../../../../../core/common/application/queries/base-query.interface';
import { PayableDto } from '@bankme/shared';

export interface GetAllPayablesQueryInput {}

export interface GetAllPayablesQueryOutput {
  payables: PayableDto[];
  total: number;
}

export class GetAllPayablesQuery
  implements BaseQuery<GetAllPayablesQueryInput, GetAllPayablesQueryOutput>
{
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(): Promise<GetAllPayablesQueryOutput> {
    return this.applicationService.execute(async () => {
      const payables = await this.payableRepository.findAll();

      return {
        payables: payables.map((payable) => payable.toDto()),
        total: payables.length,
      };
    });
  }
}
