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

export interface UserData {
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: UserData;
}

export interface OrderTicket {
    ticketTypeId: string;
    seatId: string;
}

export interface OrderRequest {
    eventId: string;
    tickets: OrderTicket[];
    user: UserData;
}

export interface OrderResponse {
    message: string;
    orderId: string;
    tickets: unknown[];
    user: UserData;
    totalAmount: number;
}