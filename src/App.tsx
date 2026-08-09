import { Seat } from '@/components/Seat.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import './App.css';
import { getEvent, getEventTickets } from '@/api/events';
import type { EventData, EventTicketsData } from '@/types/api';
import { useEffect, useReducer, useState } from 'react';
import { formatDateTime } from '@/utils/date';
import { cartReducer } from '@/state/cart';

function App() {
	const [event, setEvent] = useState<EventData | null>(null);
	const [isEventLoading, setIsEventLoading] = useState(true);
	const [eventError, setEventError] = useState<string | null>(null);
	
	const [eventTickets, setEventTickets] = useState<EventTicketsData | null>(null);
	const [isTicketsLoading, setIsTicketsLoading] = useState(false);
	const [ticketsError, setTicketsError] = useState<string | null>(null);

	const [cart, dispatchCart] = useReducer(cartReducer, []);
	const ticketCount = cart.length;
	const totalPrice = cart.reduce(
		(total, item) => total + item.ticketType.price,
		0
	);

	const isLoggedIn = false;
	
	useEffect(() => {
		let ignoreResult = false;

		getEvent()
			.then((eventData) => {
				if (!ignoreResult) {
					setEvent(eventData);
				}
			})
			.catch((error: unknown) => {
				if (!ignoreResult) {
					const message = 
						error instanceof Error
							? error.message
							: 'Nastala neznámá chyba';
					setEventError(message);
				}
			})
			.finally(() => {
				if (!ignoreResult) {
					setIsEventLoading(false);
				}
			});
		
		return () => {
			ignoreResult = true;
		};
	}, []);

	useEffect(() => {
		if (!event) {
			return;
		}

		let ignoreResult = false;

		setIsTicketsLoading(true);
		setTicketsError(null);

		getEventTickets(event.eventId)
			.then((ticketsData) => {
				if (!ignoreResult) {
					setEventTickets(ticketsData);
					
				}
			})
			.catch((error: unknown) => {
				if (!ignoreResult) {
					const message =
						error instanceof Error
							? error.message
							: 'Nastala neznámá chyba';
					
					setTicketsError(message);
				}
			})
			.finally(() => {
				if (!ignoreResult) {
					setIsTicketsLoading(false);
				}
			});
		
		return () => {
			ignoreResult = true;
		};
	}, [event]);

	if (isEventLoading) {
		return <p className="p-6 text-center">Načítám informace o akci...</p>;
	}

	if (eventError) {
		return (
			<p className="p-6 text-center text-red-600">
				{eventError}
			</p>
		);
	}

	if (!event) {
		return (
			<p className="p-6 text-center">
				Informace o akci nejsou dostupné.
			</p>
		);
	}

	const maxSeatPlace = eventTickets
		? Math.max(
				0, 
				...eventTickets.seatRows.flatMap((row) =>
					row.seats.map((seat) => seat.place)
				)
		)
		: 0;


	return (
		<div className="flex flex-col grow">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						<div className="bg-zinc-100 rounded-md size-12" />
					</div>
					{/* app/author title/name placeholder */}
					<span className="text-center font-semibold text-zinc-900">
						{event.namePub}
					</span>
					{/* user menu */}
					<div className="max-w-[250px] w-full flex justify-end">
						{
							isLoggedIn ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost">
											<div className="flex items-center gap-2">
												<Avatar>
													<AvatarImage src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`} />
													<AvatarFallback>CN</AvatarFallback>
												</Avatar>
												
												<div className="flex flex-col text-left">
													<span className="text-sm font-medium">John Doe</span>
													<span className="text-xs text-zinc-500">john.doe@nfctron.com</span>
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[250px]">
										<DropdownMenuLabel>John Doe</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem disabled>
												Logout
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button disabled variant="secondary">
									Login or register
								</Button>
							)
						}
					</div>
				</div>
			</nav>
			
			{/* main body (wrapper) */}
			<main className="grow flex flex-col justify-center pb-28">
				{/* inner content */}
				<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
					{/* seating card */}
					<section className="min-w-0 grow overflow-x-auto rounded-md bg-white p-4 shadow-sm">
						<h2 className="mb-4 text-lg font-semibold text-zinc-900">
							Vyberte si sedadla
						</h2>
						{/*	seating map */}
						{isTicketsLoading && (
							<p className="text-zinc-500">
								Načítám sedadla...
							</p>
						)}
						{ticketsError && (
							<p className="text-red-600">
								{ticketsError}
							</p>
						)}
						{eventTickets && (
							<div className="w-max min-w-full">
								<div className="mb-6 ml-12 rounded-md bg-zinc-200 py-2 text-center text-sm font-medium text-zinc-600">
									Pódium
								</div>
								<div className="flex flex-col gap-3">
									{[...eventTickets.seatRows]
										.sort((firstRow, secondRow) =>
											firstRow.seatRow - secondRow.seatRow
										)
										.map((row) => (
											<div 
												key={row.seatRow}
												className="grid items-center gap-2"
												style={{
													gridTemplateColumns: `40px repeat(${maxSeatPlace}, 40px)`
												}}
											>
												<span className="text-sm font-medium text-zinc-500">
													Řada {row.seatRow}
												</span>

												{Array.from(
													{ length: maxSeatPlace },
													(_, index) => {
														const place = index + 1;
														const seat = row.seats.find(
															(item) => item.place === place
														);
														const ticketType = seat
															? eventTickets.ticketTypes.find(
																(item) =>
																	item.id ===
																	seat.ticketTypeId
																)
															: undefined;
														return (
															<div 
																key={place}
																className="flex size-10 items-center justify-center"
															>
																{seat && ticketType && (
																	<Seat
																		seat={seat}
																		rowNumber={row.seatRow}
																		ticketType={ticketType}
																		currencyIso={event.currencyIso}
																		isInCart={cart.some(
																			(item) => item.seat.seatId === seat.seatId
																		)}
																		onToggleCart={() => {
																			dispatchCart({
																				type: 'toggle',
																				item: {
																					seat, 
																					rowNumber: row.seatRow,
																					ticketType
																				}
																			});
																		}}
																	/>	
																)}
															</div>
														);
													}
												)}
											</div>
										))}
									</div>
								</div>
						)}
					</section>
					{/* event info */}
					<aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
						{/* event header image placeholder */}
						<img 
							src={event.headerImageUrl}
							alt={event.namePub}
							className="h-40 w-full rounded-md object-cover"
						/>
						{/* event name */}
						<h1 className="text-xl text-zinc-900 font-semibold">{event.namePub}</h1>
						<div className="text-sm text-zinc-600">
							<p>
								<span className="font-medium">Místo:</span>{' '}
								{event.place}
							</p>
							<p>
								<span className="font-medium">Začátek:</span>{' '}
								{formatDateTime(event.dateFrom)}
							</p>
							<p>
								<span className="font-medium">Konec:</span>{' '}
								{formatDateTime(event.dateTo)}
							</p>
						</div>
						{/* event description */}
						<p className="text-sm text-zinc-500">{event.description}</p>
						{/* add to calendar button */}
						<Button variant="secondary" disabled>
							Add to calendar
						</Button>
					</aside>
				</div>
			</main>
			
			{/* bottom cart affix (wrapper) */}
			<nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center border-t border-zinc-200 bg-white text-zinc-900">
				{/* inner content */}
				<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
					{/* total in cart state */}
					<div className="flex flex-col">
						<span>
							Celkem za {ticketCount} vstupenek
						</span>
							
						<span className="text-2xl font-semibold">
							{new Intl.NumberFormat('cs-CZ', {
								style: 'currency',
								currency: event.currencyIso
							}).format(totalPrice)}
						</span>
					</div>
					
					{/* checkout button */}
					<Button
						disabled={cart.length === 0}
						variant="default"
					>
						Koupit vstupenky
					</Button>
				</div>
			</nav>
		</div>
	);
}

export default App;
