import { Payable } from './payable.aggregate';

describe('Payable Aggregate', () => {
  const validPayableData = {
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignorId: 'assignor-123',
  };

  describe('create', () => {
    it('should create a new payable with valid data', () => {
      const payable = Payable.create(validPayableData);

      expect(payable).toBeInstanceOf(Payable);
      expect(payable.id).toBeDefined();
      expect(payable.value).toBe(validPayableData.value);
      expect(payable.emissionDate).toBe(validPayableData.emissionDate);
      expect(payable.assignorId).toBe(validPayableData.assignorId);
      expect(payable.isActive).toBe(true);
    });

    it('should add PayableCreatedEvent when creating a new payable', () => {
      const payable = Payable.create(validPayableData);

      expect(payable.getDomainEvents()).toHaveLength(1);
      expect(payable.getDomainEvents()[0].constructor.name).toBe(
        'PayableCreatedEvent',
      );
      expect(payable.getDomainEvents()[0].payload).toEqual({
        payableId: payable.id,
        value: validPayableData.value,
        emissionDate: validPayableData.emissionDate,
        assignorId: validPayableData.assignorId,
      });
    });
  });

  describe('updateMultipleFields', () => {
    let payable: Payable;

    beforeEach(() => {
      payable = Payable.create(validPayableData);
      payable.clearDomainEvents(); // Clear creation event
    });

    it('should update value successfully', () => {
      const newValue = 200.75;
      payable.updateMultipleFields({ value: newValue });

      expect(payable.value).toBe(newValue);
      expect(payable.getDomainEvents()).toHaveLength(1);
      expect(payable.getDomainEvents()[0].constructor.name).toBe(
        'PayableUpdatedEvent',
      );
    });

    it('should update emission date successfully', () => {
      const newDate = new Date('2024-02-20');
      payable.updateMultipleFields({ emissionDate: newDate });

      expect(payable.emissionDate).toBe(newDate);
      expect(payable.getDomainEvents()).toHaveLength(1);
    });

    it('should update assignor ID successfully', () => {
      const newAssignorId = 'assignor-456';
      payable.updateMultipleFields({ assignorId: newAssignorId });

      expect(payable.assignorId).toBe(newAssignorId);
      expect(payable.getDomainEvents()).toHaveLength(1);
    });

    it('should update multiple fields at once', () => {
      const updates = {
        value: 300.25,
        emissionDate: new Date('2024-03-10'),
        assignorId: 'assignor-789',
      };

      payable.updateMultipleFields(updates);

      expect(payable.value).toBe(updates.value);
      expect(payable.emissionDate).toBe(updates.emissionDate);
      expect(payable.assignorId).toBe(updates.assignorId);
      expect(payable.getDomainEvents()).toHaveLength(1);
    });

    it('should not add event when no fields are updated', () => {
      payable.updateMultipleFields({});

      expect(payable.getDomainEvents()).toHaveLength(0);
    });

    it('should throw error when trying to update deleted payable', () => {
      payable.deactivate();

      expect(() => {
        payable.updateMultipleFields({ value: 500 });
      }).toThrow('Não é possível atualizar um payable deletado');
    });

    it('should throw error when value is zero', () => {
      expect(() => {
        payable.updateMultipleFields({ value: 0 });
      }).toThrow('Valor deve ser maior que zero');
    });

    it('should throw error when value is negative', () => {
      expect(() => {
        payable.updateMultipleFields({ value: -100 });
      }).toThrow('Valor deve ser maior que zero');
    });

    it('should throw error when emission date is null', () => {
      expect(() => {
        payable.updateMultipleFields({ emissionDate: null as unknown as Date });
      }).toThrow('Data de emissão inválida');
    });

    it('should throw error when emission date is not a Date instance', () => {
      expect(() => {
        payable.updateMultipleFields({
          emissionDate: '2024-01-15' as unknown as Date,
        });
      }).toThrow('Data de emissão inválida');
    });

    it('should throw error when assignor ID is empty', () => {
      expect(() => {
        payable.updateMultipleFields({ assignorId: '' });
      }).toThrow('ID do assignor é obrigatório');
    });

    it('should throw error when assignor ID is only whitespace', () => {
      expect(() => {
        payable.updateMultipleFields({ assignorId: '   ' });
      }).toThrow('ID do assignor é obrigatório');
    });

    it('should trim whitespace from assignor ID', () => {
      payable.updateMultipleFields({ assignorId: '  assignor-456  ' });

      expect(payable.assignorId).toBe('assignor-456');
    });
  });

  describe('toDto', () => {
    it('should return correct DTO structure', () => {
      const payable = Payable.create(validPayableData);
      const dto = payable.toDto();

      expect(dto).toEqual({
        id: payable.id,
        value: validPayableData.value,
        emissionDate: validPayableData.emissionDate,
        assignorId: validPayableData.assignorId,
      });
    });
  });

  describe('deactivate', () => {
    it('should mark payable as inactive', () => {
      const payable = Payable.create(validPayableData);

      payable.deactivate();

      expect(payable.isActive).toBe(false);
    });
  });
});
