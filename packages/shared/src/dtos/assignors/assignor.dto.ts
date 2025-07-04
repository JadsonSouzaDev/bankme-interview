import { ApiProperty } from '@nestjs/swagger';

type AssignorDtoConstructor = {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
};

export class AssignorDto {
  @ApiProperty({
    description: 'Unique ID of the assignor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the assignor',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the assignor',
    example: 'john.doe@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Document of the assignor',
    example: '123.456.789-00',
  })
  document: string;

  @ApiProperty({
    description: 'Phone of the assignor',
    example: '999999',
  })
  phone: string;

  constructor(props: AssignorDtoConstructor) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.document = props.document;
    this.phone = props.phone;
  }
}
