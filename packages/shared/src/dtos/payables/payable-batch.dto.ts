type PayableBatchDtoConstructor = {
  batchId: string;
  total: number;
  success: number;
  failed: number;
};

export class PayableBatchDto {
  batchId: string;
  total: number;
  success: number;
  failed: number;

  constructor(props: PayableBatchDtoConstructor) {
    this.batchId = props.batchId;
    this.total = props.total;
    this.success = props.success;
    this.failed = props.failed;
  }
}