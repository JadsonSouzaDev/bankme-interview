export type BatchStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

type BatchDtoConstructor = {
  id: string;
  status: BatchStatus;
  totalItems: number;
  successCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export class BatchDto {
  id: string;
  status: BatchStatus;
  totalItems: number;
  successCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: BatchDtoConstructor) {
    this.id = props.id;
    this.status = props.status;
    this.totalItems = props.totalItems;
    this.successCount = props.successCount;
    this.failedCount = props.failedCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
} 