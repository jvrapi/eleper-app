export function brDateFormatter(value: string, formatterType?: number) {
	switch (formatterType) {
		case 1:
			return value.replace(/\D/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1');

		default:
			return value
				.replace(/\D/g, '')
				.replace(/(\d{2})(\d)/, '$1/$2')
				.replace(/(\d{2})(\d)/, '$1/$2')
				.replace(/(\d{4})(\d{1,2})/, '$1');
	}
}

export function enDateFormatter(value: string) {
	const dateFormatted = value.split('/');

	return `${dateFormatted[2]}-${dateFormatted[1]}-${dateFormatted[0]}`;
}
