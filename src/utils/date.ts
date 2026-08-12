export function formatDateTime(value: string, locale: string): string {
    const date = new Date(value);

    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(date);
}
