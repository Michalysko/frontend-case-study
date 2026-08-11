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
import type { 
	EventData, 
	EventTicketsData,
	LoginRequest, 
	OrderResponse, 
	UserData,
} from '@/types/api';
import { useEffect, useReducer, useState } from 'react';
import { formatDateTime } from '@/utils/date';
import { cartReducer } from '@/state/cart';
import { GuestCheckoutForm } from '@/components/GuestCheckoutForm';
import { createOrder } from '@/api/orders';
import { LoginForm } from './components/LoginForm';
import { login } from './api/auth';
import { createCalendarContent } from './utils/calendar';

function App() {
	const [event, setEvent] = useState<EventData | null>(null);
	const [isEventLoading, setIsEventLoading] = useState(true);
	const [eventError, setEventError] = useState<string | null>(null);
	
	const [eventTickets, setEventTickets] = useState<EventTicketsData | null>(null);
	const [isTicketsLoading, setIsTicketsLoading] = useState(false);
	const [ticketsError, setTicketsError] = useState<string | null>(null);

	const [cart, dispatchCart] = useReducer(cartReducer, []);
	const [purchasedSeatIds, setPurchasedSeatIds] = useState<string[]>([])
	const ticketCount = cart.length;
	const totalPrice = cart.reduce(
		(total, item) => total + item.ticketType.price,
		0
	);

	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
	const [orderError, setOrderError] = useState<string | null>(null);
	const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);

	const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
	const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [checkoutStep, setCheckoutStep] = useState<'login' | 'guest'>('login');
	
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

	async function handleOrderSubmit(user: UserData) {
		if (!event || cart.length === 0) {
			return;
		}

		setIsOrderSubmitting(true);
		setOrderError(null);

		try {
			const result = await createOrder({
				eventId: event.eventId,
				tickets: cart.map((item) => ({
					ticketTypeId: item.ticketType.id,
					seatId: item.seat.seatId
				})),
				user
			});

			setOrderResult(result);
			setPurchasedSeatIds((currentIds) => {
				const newIds = cart.map((item) => item.seat.seatId);
				return [...new Set([...currentIds, ...newIds])];
			});
			dispatchCart({ type: 'clear' });
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Nastala neznámá chyba';

			setOrderError(message);
		} finally {
			setIsOrderSubmitting(false);
		}
	}

	async function handleLoginSubmit(
		credentials: LoginRequest
	) {
		setIsLoginSubmitting(true);
		setLoginError(null);

		try {
			const result = await login(credentials);

			setLoggedInUser(result.user);

			await handleOrderSubmit(result.user);
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Nastala neznámá chyba';
			setLoginError(message);
		} finally {
			setIsLoginSubmitting(false);
		}
	}

	function handleAddToCalendar() {
		if (!event) {
			return;
		}

		const content = createCalendarContent(event);

		const file = new Blob([content], {
			type: 'text/calendar;charset=utf-8'
		});

		const fileUrl = URL.createObjectURL(file);
		const link = document.createElement('a');

		link.href = fileUrl;
		link.download = `${event.namePub}.ics`;
		link.click();

		URL.revokeObjectURL(fileUrl);
	}

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
							loggedInUser ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost">
											<div className="flex items-center gap-2">
												<Avatar>
													<AvatarImage src={`https://source.boringavatars.com/marble/120/${encodeURIComponent(
														loggedInUser.email
													)}?colors=25106C,7F46DB`} />
													<AvatarFallback>
														{loggedInUser.firstName.charAt(0)}
														{loggedInUser.lastName.charAt(0)}
													</AvatarFallback>
												</Avatar>
												
												<div className="flex flex-col text-left">
													<span className="text-sm font-medium">
														{loggedInUser.firstName} {loggedInUser.lastName}
													</span>
													<span className="text-xs text-zinc-500">
														{loggedInUser.email}
													</span>
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[250px]">
										<DropdownMenuLabel>
											{loggedInUser.firstName} {loggedInUser.lastName}
										</DropdownMenuLabel>
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
																		isPurchased={purchasedSeatIds.includes(seat.seatId)}
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
						<Button 
							type='button'
							variant="secondary"
							onClick={handleAddToCalendar} 
						>
							Přidat do kalendáře
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
						onClick={() => {
							setOrderError(null);
							setOrderResult(null);
							setLoginError(null);
							setCheckoutStep('login');
							setIsCheckoutOpen(true);

							if (loggedInUser) {
								void handleOrderSubmit(loggedInUser);
							}
						}}
					>
						Koupit vstupenky
					</Button>
				</div>
			</nav>
			{isCheckoutOpen && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
					<div 
						role="dialog"
						aria-model="true"
						aria-label="Dokončení objednávky"
						className="w-full max-w-md rounded-lg bg-white p-6 text-zinc-900 shadow-xl"
					>
						{orderResult ? (
							<div className="flex flex-col gap-4">
								<div>
									<h2 className="text-xl font-semibold text-green-700">
										Objednávka byla vytvořena
									</h2>
									<p className="mt-2 text-sm text-zinc-600">
										Číslo objednávky: {orderResult.orderId}
									</p>
								</div>
								<Button
									type="button"
									onClick={() => setIsCheckoutOpen(false)}
								>
									Zavřít
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{orderError && (
									<p 
										role="alert"
										className="rounded-mg bg-red-50 p-3 text-sm text-red-700"
									>
										{orderError}
									</p>
								)}

								{checkoutStep === 'login' && !loggedInUser ? (
									<LoginForm
										isSubmitting={isLoginSubmitting}
										error={loginError}
										onSubmit={handleLoginSubmit}
										onContinueAsGuest={() => {
											setLoginError(null);
											setCheckoutStep('guest');
										}}
										onCancel={() => setIsCheckoutOpen(false)}
									/>
								) : loggedInUser && isOrderSubmitting ? (
									<p className='py-8 text-center text-zinc-600'>
										Vytvářím objednávku...
									</p>
								) : (
									<GuestCheckoutForm
										isSubmitting={isOrderSubmitting}
										onCancel={() => setIsCheckoutOpen(false)}
										onSubmit={handleOrderSubmit}
									/>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
