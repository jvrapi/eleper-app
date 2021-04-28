export function cutName(name: string) {
  return name.split(/\s+/g)[0];
}

export function DateTimeToBrDate(date: string) {
  const dateOnly = date.split('T')[0];

  return UsDateToBrDate(dateOnly);
}

export function UsDateToBrDate(date: string) {
  const dateArray = date.split('-');
  const day = dateArray[2];
  const month = dateArray[1];
  const year = dateArray[0];
  return `${day}/${month}/${year}`;
}
