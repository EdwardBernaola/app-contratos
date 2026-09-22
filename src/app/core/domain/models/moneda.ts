export enum Moneda {
  COP = 'COP',
  USD = 'USD',
  EUR = 'EUR',
}

export const MONEDAS: { valor: Moneda; etiqueta: string; simbolo: string }[] = [
  { valor: Moneda.COP, etiqueta: 'Peso Colombiano (COP)', simbolo: '$' },
  { valor: Moneda.USD, etiqueta: 'Dólar Americano (USD)', simbolo: 'US$' },
  { valor: Moneda.EUR, etiqueta: 'Euro (EUR)', simbolo: '€' },
];