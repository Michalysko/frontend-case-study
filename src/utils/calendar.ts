import type { EventData } from '@/types/api';

function formatCalendarDate(value: string): string {
    return new Date(value)
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
}

function escapeCalendarText(value: string): string {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;');
}

export function createCalendarContent(event: EventData): string {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Frontend Case Study//CS',
        'BEGIN:VEVENT',
        `UID:${event.eventId}`,
        `DTSTART:${formatCalendarDate(event.dateFrom)}`,
        `DTEND:${formatCalendarDate(event.dateTo)}`,
        `SUMMARY:${escapeCalendarText(event.namePub)}`,
        `DESCRIPTION:${escapeCalendarText(event.description)}`,
        `LOCATION:${escapeCalendarText(event.place)}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];

    return lines.join('\r\n');
}