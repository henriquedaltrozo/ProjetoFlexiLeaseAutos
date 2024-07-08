import { format, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  if (typeof date === 'string') {
    return format(parseISO(date), 'dd/MM/yyyy');
  }
  return format(date, 'dd/MM/yyyy');
};
