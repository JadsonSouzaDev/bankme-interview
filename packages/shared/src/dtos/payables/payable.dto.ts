type PayableDtoConstructor = {
  id: string;
  assignorId: string;
  value: number;
  emissionDate: Date;
  batchId?: string;
};

export class PayableDto {
  id: string;
  assignorId: string;
  value: number;
  emissionDate: Date;
  batchId?: string;

  constructor(props: PayableDtoConstructor) {
    this.id = props.id;
    this.assignorId = props.assignorId;
    this.value = props.value;
    this.emissionDate = props.emissionDate;
    this.batchId = props.batchId;
  }
}