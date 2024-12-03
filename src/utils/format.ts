export const formatCompactNumber = (num: number): string => {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(num);
  };