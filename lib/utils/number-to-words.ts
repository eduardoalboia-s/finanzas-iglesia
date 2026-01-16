export function numberToWords(amount: number): string {
  if (amount === 0) return 'CERO PESOS';

  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const diez_veinte = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertGroup(n: number): string {
    let output = '';

    if (n === 100) return 'CIEN';

    // Centenas
    if (n >= 100) {
      output += centenas[Math.floor(n / 100)] + ' ';
      n %= 100;
    }

    // Decenas
    if (n >= 20) {
      output += decenas[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) output += ' Y ';
    } else if (n >= 10) {
      output += diez_veinte[n - 10];
      n = 0;
    }

    // Unidades
    if (n > 0) {
      output += unidades[n];
    }

    return output.trim();
  }

  let words = '';
  
  // Millones
  if (amount >= 1000000) {
    const millones = Math.floor(amount / 1000000);
    if (millones === 1) words += 'UN MILLON ';
    else words += convertGroup(millones) + ' MILLONES ';
    amount %= 1000000;
  }

  // Miles
  if (amount >= 1000) {
    const miles = Math.floor(amount / 1000);
    if (miles === 1) words += 'MIL ';
    else words += convertGroup(miles) + ' MIL ';
    amount %= 1000;
  }

  // Resto
  if (amount > 0) {
    words += convertGroup(amount);
  }

  return (words.trim() + ' PESOS').replace('  ', ' ');
}
