import type { SeatData, TicketType } from '@/types/api';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface SeatProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	seat: SeatData;
	rowNumber: number;
	ticketType: TicketType;
}

export const Seat = React.forwardRef<HTMLButtonElement, SeatProps>(
	(
		{
			seat,
			rowNumber,
			ticketType,
			className,
			...buttonProps
		},
		ref
	) => {
		const isInCart = false;
	
		return (
			<Popover>
				<PopoverTrigger asChild>
					<button 
						ref={ref}
						type="button"
						className={cn(
							'flex size-8 items-center justify-center rounded-full',
							'bg-zinc-100 text-xs font-medium text-zinc-600',
							'transition-colors hover:bg-zinc-200',
							className
						)}
						aria-label={`Řada ${rowNumber}, sedadlo ${seat.place}`}
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
								{ticketType.price}
							</p>
						</div>

						{isInCart ? (
							<Button
								disabled
								variant="destructive"
								size="sm"
							>
								Odebrat z košíku
							</Button>
						) : (
							<Button disabled size="sm">
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
