'use server';

import { cookies } from 'next/headers';
import { PayableDto } from '@bankme/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/integrations';

export async function getPayablesAction(): Promise<{payables: PayableDto[], total: number}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/payable`, {
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
      throw new Error(`Failed to fetch payables: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      payables: data.payables.map((payable: PayableDto) => ({
        ...payable,
        emissionDate: new Date(new Date(payable.emissionDate))
      })),
      total: data.total
    };
  } catch (error) {
    console.error('Error fetching payables:', error);
    throw error;
  }
}