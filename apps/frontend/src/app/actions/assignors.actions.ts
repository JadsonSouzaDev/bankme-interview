'use server';

import { cookies } from 'next/headers';
import { AssignorDto } from '@bankme/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getAssignorsAction(): Promise<{assignors: AssignorDto[], total: number}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/assignor`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`Failed to fetch assignors: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching assignors:', error);
    throw error;
  }
} 