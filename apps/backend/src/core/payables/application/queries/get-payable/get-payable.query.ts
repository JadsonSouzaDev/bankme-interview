import { NotFoundException } from '@nestjs/common';
import { Payable } from '../../../domain/payable.aggregate';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseQuery } from '../../../../../core/common/application/queries/base-query.interface';

export interface GetPayableQueryInput {
  id: string;
}

export class GetPayableQuery
  implements BaseQuery<GetPayableQueryInput, Payable>
{
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(input: GetPayableQueryInput): Promise<Payable> {
    return this.applicationService.execute(async () => {
      const payable = await this.payableRepository.findById(input.id);
      if (!payable) {
        throw new NotFoundException('Payable not found');
      }

      return payable;
    });
  }
}
