import api from "@/lib/axios";
import { AssignorDto, CreateAssignorDto, UpdateAssignorDto } from "@bankme/shared";

export class AssignorsService {
  async create(data: CreateAssignorDto): Promise<AssignorDto> {
    const response = await api.post<AssignorDto>("/assignor", data);
    return response.data;
  }

  async update(id: string, data: UpdateAssignorDto): Promise<AssignorDto> {
    const response = await api.put<AssignorDto>(`/assignor/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/assignor/${id}`);
  }
}

export const assignorsService = new AssignorsService();