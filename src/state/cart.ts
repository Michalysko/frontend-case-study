import type { SeatData, TicketType } from '@/types/api';

export interface CartItem {
    seat: SeatData;
    rowNumber: number;
    ticketType: TicketType;
}

export type CartAction =
    |   {
            type: 'toggle';
            item: CartItem;
        }
    | {
            type: 'clear';
    };

export function cartReducer(
    state: CartItem[],
    action: CartAction
): CartItem[] {
    switch (action.type) {
        case 'toggle': {
            const isAlreadyInCart = state.some(
                (item) =>
                    item.seat.seatId === action.item.seat.seatId
            );

            if (isAlreadyInCart) {
                return state.filter(
                    (item) =>
                        item.seat.seatId !== action.item.seat.seatId
                );
            }

            return [...state, action.item];
        }

        case 'clear':
            return [];

        default:
            return state;
    }
}