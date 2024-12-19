import {Injectable} from '@angular/core';

@Injectable()
export class FormatterService {
    public formatPhoneNumber(phone: string): string {
        if (!phone) return '';

        const cleanedPhone: string = phone.replace(/\D/g, '');

        const groups: RegExpMatchArray = cleanedPhone.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)!;

        if (!groups) return phone;

        return `+${groups[1]} ${groups[2]} ${groups[3]}-${groups[4]}-${groups[5]}`;
    }

    /**
     * Formats a given ISO date string to Russian format dd.MM.yyyy
     * @param date The date in ISO format
     * @returns The formatted date as dd.MM.yyyy
     */
    public formatBirthDate(date: string | Date): string {
        if (!date) {
            return '';
        }
        const parsedDate: Date = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.warn('Invalid date:', date);
            return '';
        }
        const day: string = String(parsedDate.getDate()).padStart(2, '0');
        const month: string = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year: number = parsedDate.getFullYear();

        return `${day}.${month}.${year}`;
    }

    public formatFullName(fullName: string): string {
        if (!fullName) return '';

        const nameParts: string[] = fullName.trim().split(/\s+/);

        if (nameParts.length === 1) {
            return nameParts[0]
        }

        const [surname, firstName, lastName] = nameParts;

        const formattedName: string = `${surname} ${firstName?.charAt(0).toUpperCase()}. ` +
            (lastName ? `${lastName?.charAt(0).toUpperCase()}.` : '');

        return formattedName;
    }

    public formatTime(date: string | Date): string {
        if (!date) {
            return '';
        }
        const parsedDate: Date = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.warn('Invalid date:', date);
            return '';
        }
        const hour: string = String(parsedDate.getHours()).padStart(2, '0');
        const minutes: string = String(parsedDate.getMinutes()).padStart(2, '0');

        return `${hour}:${minutes}`;
    }
}
