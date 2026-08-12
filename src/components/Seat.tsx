import type { SeatData, TicketType } from '@/types/api';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';
import { useI18n } from '@/i18n/I18nContext';

interface SeatProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
		seat: SeatData;
		rowNumber: number;
		ticketType: TicketType;
		currencyIso: string;
		isInCart: boolean;
		isPurchased: boolean;
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
			isPurchased,
			onToggleCart,
			className,
			...buttonProps
		},
		ref
	) => {
		const { locale, t } = useI18n();

		const formattedPrice = new Intl.NumberFormat(locale, {
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
							isPurchased
								? 'cursor-not-allowed bg-emerald-600 text-white opacity-70'
								: isInCart
									? 'bg-violet-600 text-white hover:bg-violet-700'
									: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
							className
						)}
						aria-label={`${t('row')} ${rowNumber}, ${t('seat')} ${seat.place}${
							isPurchased
								? `, ${t('purchased')}`
								: isInCart 
									? `, ${t('selected')}` 
									: ''
						}`}
						{...buttonProps}
						disabled={isPurchased}
					>
						{seat.place}
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-64">
					<div className="flex flex-col gap-3">
						<div>
							<p className="font-semibold">
								{t('row')} {rowNumber}, {t('seat')} {seat.place}
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
								{t('removeFromCart')}
							</Button>
						) : (
							<Button 
								type="button"
								size="sm"
								onClick={onToggleCart}
							>	
								{t('addToCart')}
							</Button>
						)}
					</div>
				</PopoverContent>
			</Popover>
		);
	}
);

Seat.displayName = 'Seat';
