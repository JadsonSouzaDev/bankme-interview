import { BatchDto } from '@bankme/shared';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseQuery } from '../../../../common/application/queries/base-query.interface';
import { BatchRepository } from '../../../domain/batch.repository';

export interface GetBatchQueryInput {
  id: string;
}

type GetBatchQueryOutput = BatchDto | undefined;

export class GetBatchQuery
  implements BaseQuery<GetBatchQueryInput, GetBatchQueryOutput>
{
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly batchRepository: BatchRepository,
  ) {}

  async execute(input: GetBatchQueryInput): Promise<GetBatchQueryOutput> {
    return this.applicationService.execute(async () => {
      const batch = await this.batchRepository.findById(input.id);
      return batch ? batch.toDto() : undefined;
    });
  }
}
