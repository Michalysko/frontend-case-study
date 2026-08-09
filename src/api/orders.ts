import type {
    OrderRequest,
    OrderResponse
} from '@/types/api';

const API_URL = '/api';

export async function createOrder(
    order: OrderRequest
): Promise<OrderResponse> {
    const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'applycation/json'
        },
        body: JSON.stringify(order)
    });

    if (!response.ok) {
        throw new Error(
            `Objednávku se nepodařilo vytvořit: ${response.status}`
        );
    }

    return response.json() as Promise<OrderResponse>;
}