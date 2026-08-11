import { Button } from '@/components/ui/button';
import type { UserData } from '@/types/api';
import { useState, type FormEvent } from 'react';

interface GuestCheckoutFormProps {
    isSubmitting: boolean;
    onCancel: () => void;
    onSubmit: (user: UserData) => void;
}

export function GuestCheckoutForm({
    isSubmitting,
    onCancel,
    onSubmit
}: GuestCheckoutFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onSubmit({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim()
        });
    }

    return (
        <form 
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                    Kontaktní údaje
                </h2>

                <p className="text-sm text-zinc-500">
                    Vyplňte údaje potřebné pro vytvoření objednávky.
                </p>
            </div>

            <label className="flex flex-col gap-1 text-sm text-zinc-700">
                Jméno
                <input 
                    required
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) =>
                        setFirstName(event.target.value)
                    }
                    className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
                Příjmení
                <input 
                    required
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) =>
                        setLastName(event.target.value)
                    }
                    className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
                E-mail
                <input 
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
            </label>
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={onCancel}
                >
                    Zrušit
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'Vytvářím objednávku...'
                        : 'Dokončit objednávku'}
                </Button>
            </div>
        </form>
    );
}