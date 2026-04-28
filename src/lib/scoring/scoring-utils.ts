import { ScoreLabel } from './scoring-types';

export const mapValueToLabel = (value: number): ScoreLabel => {
  if (value < 40) return 'low';
  if (value < 75) return 'medium';
  return 'high';
};

export const mapValueToInvertedLabel = (value: number): ScoreLabel => {
  if (value < 40) return 'high';
  if (value < 75) return 'medium';
  return 'low';
};

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
};

export const getArabicLabel = (label: ScoreLabel): string => {
  switch (label) {
    case 'low': return 'منخفض';
    case 'medium': return 'متوسط';
    case 'high': return 'مرتفع';
  }
};
