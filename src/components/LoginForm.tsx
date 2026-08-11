import { Button } from '@/components/ui/button';
import type { LoginRequest } from '@/types/api';
import { useState, type FormEvent } from 'react';

interface LoginFormProps {
    isSubmitting: boolean;
    error: string | null;
    onSubmit: (credentials: LoginRequest) => void;
    onContinueAsGuest: () => void;
    onCancel: () => void;
}

export function LoginForm({
    isSubmitting,
    error,
    onSubmit,
    onContinueAsGuest,
    onCancel
}: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onSubmit({
            email: email.trim(),
            password
        });
    }

    return (
        <form 
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}
        >
            <div>
                <h2 className='text-xl font-semibold text-zinc-900'>
                    Přihlášení
                </h2>
                <p className='text-sm text-zinc-500'>
                    Přihlaste se, nebo pokračujte v objednávce jako host.
                </p>
            </div>

            {error && (
                <p 
                    role='alert'
                    className='rounded-md bg-red-50 p-3 text-sm text-red-700'
                >
                    {error}
                </p>
            )}
            
            <label className='flex flex-col gap-1 text-sm text-zinc-700'>
                E-mail
                <input 
                    required
                    type='email'
                    autoComplete='email'
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                />
            </label>
            <label className='flex flex-col gap-1 text-sm text-zinc-700'>
                Heslo
                <input 
                    required
                    type='password'
                    autoComplete='current-password'
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                />
            </label>

            <p className='rounded-md bg-zinc-50 p-3 text-xs text-zinc-600'>
                Testovací účet: frontend@nfctron.com<br/>
                Heslo: Nfctron2025
            </p>

            <div className='flex flex-col gap-2'>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'Přihlašuji...'
                        : 'Přihlásit se'}
                </Button>
                <Button
                    type='button'
                    variant='secondary'
                    disabled={isSubmitting}
                    onClick={onContinueAsGuest}
                >
                    Pokračovat jako host
                </Button>
                <Button
                    type='button'
                    variant='ghost'
                    disabled={isSubmitting}
                    onClick={onCancel}
                >
                    Zrušit
                </Button>
            </div>
        </form>
    );
}