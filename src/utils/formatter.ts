export function brDateFormatter(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1');
}

export function enDateFormatter(value: string) {
  const dateFormatted = value.split('/');

  return `${dateFormatted[2]}-${dateFormatted[1]}-${dateFormatted[0]}`;
}
