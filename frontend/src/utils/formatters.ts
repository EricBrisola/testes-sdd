export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function formatarData(dataIsoOuString: string | Date): string {
  try {
    const dataObj = typeof dataIsoOuString === 'string' ? new Date(dataIsoOuString) : dataIsoOuString;
    // Se a data contiver parte horária ou for UTC pura (ex: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
    // Extrai ano, mês, dia para evitar desvios de fuso horário
    if (typeof dataIsoOuString === 'string' && dataIsoOuString.includes('-')) {
      const datePart = dataIsoOuString.split('T')[0];
      const [ano, mes, dia] = datePart.split('-');
      if (ano && mes && dia) {
        return `${dia}/${mes}/${ano}`;
      }
    }
    return dataObj.toLocaleDateString('pt-BR');
  } catch {
    return String(dataIsoOuString);
  }
}
