type PayableDtoConstructor = {
  id: string;
  assignorId: string;
  value: number;
  emissionDate: Date;
};

export class PayableDto {
  id: string;
  assignorId: string;
  value: number;
  emissionDate: Date;

  constructor(props: PayableDtoConstructor) {
    this.id = props.id;
    this.assignorId = props.assignorId;
    this.value = props.value;
    this.emissionDate = props.emissionDate;
  }
}