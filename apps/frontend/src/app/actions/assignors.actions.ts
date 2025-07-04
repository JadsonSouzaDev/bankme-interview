"use server";

import { AssignorDto } from "@bankme/shared";
import { getToken } from "@/lib/auth";

const API_URL =
  process.env.API_URL || "http://localhost:3001/integrations";

export async function getAssignorsAction(): Promise<{
  assignors: AssignorDto[];
  total: number;
}> {
  try {
    const token = await getToken();

    const response = await fetch(`${API_URL}/assignor`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(`Failed to fetch assignors: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching assignors:", error);
    throw error;
  }
}

export async function getAssignorByIdAction(id: string): Promise<AssignorDto> {
  try {
    const token = await getToken();

    const response = await fetch(`${API_URL}/assignor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(`Failed to fetch assignor by id: ${response.statusText}`);
    }

    const assignor = await response.json();
    return assignor;
  } catch (error) {
    console.error("Error fetching assignors:", error);
    throw error;
  }
}
