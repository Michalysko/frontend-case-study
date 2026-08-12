export const translations = {
	cs: {
		loadingEvent: 'Načítám informace o akci…', unavailableEvent: 'Informace o akci nejsou dostupné.',
		logout: 'Odhlásit se', loginOrRegister: 'Přihlásit se nebo registrovat', chooseSeats: 'Vyberte si sedadla',
		loadingSeats: 'Načítám sedadla…', stage: 'Pódium', row: 'Řada', seat: 'sedadlo', selected: 'vybráno', purchased: 'zakoupeno',
		place: 'Místo', start: 'Začátek', end: 'Konec', addCalendar: 'Přidat do kalendáře',
		cartTotal: 'Celkem za {{count}} vstupenek', buyTickets: 'Koupit vstupenky', completeOrder: 'Dokončení objednávky',
		orderCreated: 'Objednávka byla vytvořena', orderNumber: 'Číslo objednávky', close: 'Zavřít', creatingOrder: 'Vytvářím objednávku…',
		addToCart: 'Přidat do košíku', removeFromCart: 'Odebrat z košíku', contactDetails: 'Kontaktní údaje',
		contactHelp: 'Vyplňte údaje potřebné pro vytvoření objednávky.', firstName: 'Jméno', lastName: 'Příjmení', email: 'E-mail',
		cancel: 'Zrušit', finishOrder: 'Dokončit objednávku', login: 'Přihlášení', loginHelp: 'Přihlaste se, nebo pokračujte v objednávce jako host.',
		password: 'Heslo', testAccount: 'Testovací účet', signingIn: 'Přihlašuji…', signIn: 'Přihlásit se', continueGuest: 'Pokračovat jako host'
	},
	en: {
		loadingEvent: 'Loading event information…', unavailableEvent: 'Event information is unavailable.',
		logout: 'Log out', loginOrRegister: 'Log in or register', chooseSeats: 'Choose your seats',
		loadingSeats: 'Loading seats…', stage: 'Stage', row: 'Row', seat: 'seat', selected: 'selected', purchased: 'purchased',
		place: 'Venue', start: 'Start', end: 'End', addCalendar: 'Add to calendar',
		cartTotal: 'Total for {{count}} tickets', buyTickets: 'Buy tickets', completeOrder: 'Complete order',
		orderCreated: 'Order created', orderNumber: 'Order number', close: 'Close', creatingOrder: 'Creating order…',
		addToCart: 'Add to cart', removeFromCart: 'Remove from cart', contactDetails: 'Contact details',
		contactHelp: 'Enter the details required to create the order.', firstName: 'First name', lastName: 'Last name', email: 'Email',
		cancel: 'Cancel', finishOrder: 'Complete order', login: 'Log in', loginHelp: 'Log in or continue with your order as a guest.',
		password: 'Password', testAccount: 'Test account', signingIn: 'Signing in…', signIn: 'Log in', continueGuest: 'Continue as guest'
	}
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.cs;
