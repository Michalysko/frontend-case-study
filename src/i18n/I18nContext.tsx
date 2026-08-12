import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from './translations';

interface I18nValue {
	language: Language;
	locale: string;
	setLanguage: (language: Language) => void;
	t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>('cs');
	const value = useMemo<I18nValue>(() => ({
		language,
		locale: language === 'cs' ? 'cs-CZ' : 'en-US',
		setLanguage,
		t: (key, values = {}) => Object.entries(values).reduce(
			(text, [name, replacement]) => text.split(`{{${name}}}`).join(String(replacement)),
			translations[language][key] as string
		)
	}), [language]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// The hook intentionally lives beside its small provider for this local i18n module.
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) throw new Error('useI18n must be used inside I18nProvider');
	return context;
}
