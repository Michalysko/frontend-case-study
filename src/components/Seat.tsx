import type { SeatData, TicketType } from '@/types/api';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface SeatProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
		seat: SeatData;
		rowNumber: number;
		ticketType: TicketType;
		currencyIso: string;
		isInCart: boolean;
		onToggleCart: () => void;
}

export const Seat = React.forwardRef<HTMLButtonElement, SeatProps>(
	(
		{
			seat,
			rowNumber,
			ticketType,
			currencyIso,
			isInCart,
			onToggleCart,
			className,
			...buttonProps
		},
		ref
	) => {

		const formattedPrice = new Intl.NumberFormat('cs-CZ', {
			style: 'currency',
			currency: currencyIso
		}).format(ticketType.price);

		return (
			<Popover>
				<PopoverTrigger asChild>
					<button 
						ref={ref}
						type="button"
						className={cn(
							'flex size-8 items-center justify-center rounded-full',
							'text-xs font-medium transition-colors',
							isInCart
								? 'bg-violet-600 text-white hover:bg-violet-700'
								: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
							className
						)}
						aria-label={`Řada ${rowNumber}, sedadlo ${seat.place}${
							isInCart ? ', vybráno' : ''
						}`}
						{...buttonProps}
					>
						{seat.place}
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-64">
					<div className="flex flex-col gap-3">
						<div>
							<p className="font-semibold">
								Řada {rowNumber}, sedadlo {seat.place}
							</p>
							<p className="text-sm text-zinc-500">
								{ticketType.name}
							</p>
							<p className="text-sm font-medium">
								{formattedPrice}
							</p>
						</div>

						{isInCart ? (
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={onToggleCart}
							>
								Odebrat z košíku
							</Button>
						) : (
							<Button 
								type="button"
								size="sm"
								onClick={onToggleCart}
							>	
								Přidat do košíku
							</Button>
						)}
					</div>
				</PopoverContent>
			</Popover>
		);
	}
);

Seat.displayName = 'Seat';
