import { format } from 'date-fns';

export default function transformDate(date: string) {
    const utcDate = new Date(date);

	const taiwanDateString = format(utcDate, 'yyyy-MM-dd HH:mm');

	return taiwanDateString;
}