export function formatDateTime(value: string): string {
    const date = new Date(value);

    return new Intl.DateTimeFormat('cs-CZ', {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(date);
}