type AssignorDtoConstructor = {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
};

export class AssignorDto {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;

  constructor(props: AssignorDtoConstructor) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.document = props.document;
    this.phone = props.phone;
  }
}
