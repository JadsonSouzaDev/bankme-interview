type PayableConstructor = {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
};

export class Payable {
  public readonly id: string;
  public value: number;
  public emissionDate: Date;
  public assignorId: string;

  constructor(props: PayableConstructor) {
    this.id = props.id;
    this.value = props.value;
    this.emissionDate = props.emissionDate;
    this.assignorId = props.assignorId;
  }
}
