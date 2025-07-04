import api from "@/lib/axios";
import { PayableDto, CreatePayableDto, UpdatePayableDto } from "@bankme/shared";

export class PayableService {
  async create(data: CreatePayableDto): Promise<PayableDto> {
    const response = await api.post<PayableDto>("/payable", data);
    return response.data;
  }

  async update(id: string, data: UpdatePayableDto): Promise<PayableDto> {
    const response = await api.patch<PayableDto>(`/payable/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/payable/${id}`);
  }
}

export const payableService = new PayableService();