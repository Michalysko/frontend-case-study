import type { EventData, EventTicketsData } from '@/types/api';

const API_URL = '/api';

export async function getEvent(): Promise<EventData> {
    const response = await fetch(`${API_URL}/event`);

    if (!response.ok) {
        throw new Error(`Nepodařilo se načíst akci: ${response.status}`);
    }

    return response.json() as Promise<EventData>;
    
}

export async function getEventTickets(
    eventId: string
): Promise<EventTicketsData> {
    const searchParams = new URLSearchParams({
        eventId
    });

    const response = await fetch(
        `${API_URL}/event-tickets?${searchParams.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Nepodařilo se načíst sedadla: ${response.status}`
        );
    }

    return response.json() as Promise<EventTicketsData>;
}