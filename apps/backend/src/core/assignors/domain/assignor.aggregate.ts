type AssignorConstructor = {
  id: string;
  document: string;
  email: string;
  phone: string;
  name: string;
};

export class Assignor {
  public readonly id: string;
  public document: string;
  public email: string;
  public phone: string;
  public name: string;

  constructor(props: AssignorConstructor) {
    this.id = props.id;
    this.document = props.document;
    this.email = props.email;
    this.phone = props.phone;
    this.name = props.name;
  }
}
