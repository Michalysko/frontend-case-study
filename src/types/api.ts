export interface EventData {
    eventId: string;
    namePub: string;
    description: string;
    currencyIso: string;
    dateFrom: string;
    dateTo: string;
    headerImageUrl: string;
    place: string;
}

export interface TicketType {
    id: string;
    name: string;
    price: number;
}

export interface SeatData {
    seatId: string;
    place: number;
    ticketTypeId: string;
}

export interface SeatRow {
    seatRow: number;
    seats: SeatData[];
}

export interface EventTicketsData {
    ticketTypes: TicketType[];
    seatRows: SeatRow[];
}