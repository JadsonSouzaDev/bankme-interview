import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';

export interface DeleteAssignorCommandInput {
  id: string;
}

export interface DeleteAssignorCommandOutput {
  success: boolean;
  message: string;
}

export class DeleteAssignorCommand
  implements
    BaseCommand<DeleteAssignorCommandInput, DeleteAssignorCommandOutput>
{
  constructor(
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(
    dto: DeleteAssignorCommandInput,
  ): Promise<DeleteAssignorCommandOutput> {
    return this.applicationService.execute(async () => {
      const { id } = dto;

      // Buscar o assignor pelo ID
      const assignor = await this.assignorRepository.findById(id);

      if (!assignor) {
        throw new NotFoundException('Assignor não encontrado');
      }

      // Verificar se o assignor já está inativo
      if (!assignor.isActive) {
        throw new BadRequestException('Assignor já foi deletado');
      }

      // Desativar o assignor (soft delete)
      assignor.deactivate();

      // Salvar as mudanças
      await this.assignorRepository.save(assignor);

      return {
        success: true,
        message: 'Assignor deletado com sucesso',
      };
    });
  }
}
