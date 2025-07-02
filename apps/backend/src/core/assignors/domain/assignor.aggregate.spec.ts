import { Assignor } from './assignor.aggregate';

describe('Assignor Aggregate', () => {
  const validAssignorData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  };

  describe('create', () => {
    it('should create a new assignor with valid data', () => {
      const assignor = Assignor.create(validAssignorData);

      expect(assignor).toBeInstanceOf(Assignor);
      expect(assignor.id).toBeDefined();
      expect(assignor.name).toBe(validAssignorData.name);
      expect(assignor.email).toBe(validAssignorData.email);
      expect(assignor.document).toBe(validAssignorData.document);
      expect(assignor.phone).toBe(validAssignorData.phone);
      expect(assignor.isActive).toBe(true);
    });

    it('should add AssignorCreatedEvent when creating a new assignor', () => {
      const assignor = Assignor.create(validAssignorData);

      expect(assignor.getDomainEvents()).toHaveLength(1);
      expect(assignor.getDomainEvents()[0].constructor.name).toBe(
        'AssignorCreatedEvent',
      );
      expect(assignor.getDomainEvents()[0].payload).toEqual({
        assignorId: assignor.id,
        name: validAssignorData.name,
        email: validAssignorData.email,
        document: validAssignorData.document,
        phone: validAssignorData.phone,
      });
    });
  });

  describe('updateMultipleFields', () => {
    let assignor: Assignor;

    beforeEach(() => {
      assignor = Assignor.create(validAssignorData);
      assignor.clearDomainEvents(); // Clear creation event
    });

    it('should update name successfully', () => {
      const newName = 'Jane Doe';
      assignor.updateMultipleFields({ name: newName });

      expect(assignor.name).toBe(newName);
      expect(assignor.getDomainEvents()).toHaveLength(1);
      expect(assignor.getDomainEvents()[0].constructor.name).toBe(
        'AssignorUpdatedEvent',
      );
    });

    it('should update email successfully', () => {
      const newEmail = 'jane.doe@example.com';
      assignor.updateMultipleFields({ email: newEmail });

      expect(assignor.email).toBe(newEmail.toLowerCase());
      expect(assignor.getDomainEvents()).toHaveLength(1);
    });

    it('should update document successfully', () => {
      const newDocument = '98765432109';
      assignor.updateMultipleFields({ document: newDocument });

      expect(assignor.document).toBe(newDocument);
      expect(assignor.getDomainEvents()).toHaveLength(1);
    });

    it('should update phone successfully', () => {
      const newPhone = '11876543210';
      assignor.updateMultipleFields({ phone: newPhone });

      expect(assignor.phone).toBe(newPhone);
      expect(assignor.getDomainEvents()).toHaveLength(1);
    });

    it('should update multiple fields at once', () => {
      const updates = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '11876543210',
      };

      assignor.updateMultipleFields(updates);

      expect(assignor.name).toBe(updates.name);
      expect(assignor.email).toBe(updates.email.toLowerCase());
      expect(assignor.phone).toBe(updates.phone);
      expect(assignor.getDomainEvents()).toHaveLength(1);
    });

    it('should not add event when no fields are updated', () => {
      assignor.updateMultipleFields({});

      expect(assignor.getDomainEvents()).toHaveLength(0);
    });

    it('should throw error when trying to update deleted assignor', () => {
      assignor.deactivate();

      expect(() => {
        assignor.updateMultipleFields({ name: 'New Name' });
      }).toThrow('Não é possível atualizar um assignor deletado');
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        assignor.updateMultipleFields({ name: '' });
      }).toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('should throw error when name is too short', () => {
      expect(() => {
        assignor.updateMultipleFields({ name: 'A' });
      }).toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('should throw error when email is empty', () => {
      expect(() => {
        assignor.updateMultipleFields({ email: '' });
      }).toThrow('Email inválido');
    });

    it('should throw error when document is empty', () => {
      expect(() => {
        assignor.updateMultipleFields({ document: '' });
      }).toThrow('Documento deve ter pelo menos 7 caracteres');
    });

    it('should throw error when document is too short', () => {
      expect(() => {
        assignor.updateMultipleFields({ document: '123456' });
      }).toThrow('Documento deve ter pelo menos 7 caracteres');
    });

    it('should throw error when phone is empty', () => {
      expect(() => {
        assignor.updateMultipleFields({ phone: '' });
      }).toThrow('Telefone deve ter pelo menos 10 caracteres');
    });

    it('should throw error when phone is too short', () => {
      expect(() => {
        assignor.updateMultipleFields({ phone: '123456789' });
      }).toThrow('Telefone deve ter pelo menos 10 caracteres');
    });

    it('should trim whitespace from updated fields', () => {
      assignor.updateMultipleFields({
        name: '  Jane Doe  ',
        email: '  JANE.DOE@EXAMPLE.COM  ',
        document: '  98765432109  ',
        phone: '  11876543210  ',
      });

      expect(assignor.name).toBe('Jane Doe');
      expect(assignor.email).toBe('jane.doe@example.com');
      expect(assignor.document).toBe('98765432109');
      expect(assignor.phone).toBe('11876543210');
    });
  });

  describe('toDto', () => {
    it('should return correct DTO structure', () => {
      const assignor = Assignor.create(validAssignorData);
      const dto = assignor.toDto();

      expect(dto).toEqual({
        id: assignor.id,
        name: validAssignorData.name,
        email: validAssignorData.email,
        document: validAssignorData.document,
        phone: validAssignorData.phone,
      });
    });
  });

  describe('deactivate', () => {
    it('should mark assignor as inactive', () => {
      const assignor = Assignor.create(validAssignorData);

      assignor.deactivate();

      expect(assignor.isActive).toBe(false);
    });
  });
});
