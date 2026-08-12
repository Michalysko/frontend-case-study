import { Button } from '@/components/ui/button';
import type { LoginRequest } from '@/types/api';
import { useState, type FormEvent } from 'react';
import { useI18n } from '@/i18n/I18nContext';

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
	const { t } = useI18n();
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
                    {t('login')}
                </h2>
                <p className='text-sm text-zinc-500'>
                    {t('loginHelp')}
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
                {t('email')}
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
                {t('password')}
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
                {t('testAccount')}: frontend@nfctron.com<br/>
                {t('password')}: Nfctron2025
            </p>

            <div className='flex flex-col gap-2'>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t('signingIn')
                        : t('signIn')}
                </Button>
                <Button
                    type='button'
                    variant='secondary'
                    disabled={isSubmitting}
                    onClick={onContinueAsGuest}
                >
                    {t('continueGuest')}
                </Button>
                <Button
                    type='button'
                    variant='ghost'
                    disabled={isSubmitting}
                    onClick={onCancel}
                >
                    {t('cancel')}
                </Button>
            </div>
        </form>
    );
}
