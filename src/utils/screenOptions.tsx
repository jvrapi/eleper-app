import { pageIcons } from '../assets/icons';
export const homeOptions = [
	{
		title: 'Minhas doenças',
		icon: pageIcons.diseaseIcon,
		info: 'Gereciamento das doenças que você me informou anteriormente',
		route: { name: 'Disease' },
	},

	{
		title: 'Minhas Anotações',
		icon: pageIcons.annotationsIcon,
		info: 'Faça anotações importantes sobre a sua saúde, como por exemplo, taxa de glicose ou pressão arterial',
		route: { name: 'Annotations' },
	},

	{
		title: 'Minhas internações',
		icon: pageIcons.hospitalizationIcon,
		info: 'Complete seu histórico me informando suas internações hospitalares',
		route: { name: 'Hospitalization' },
	},
	{
		title: 'Minhas Cirurgias',
		icon: pageIcons.surgeryIcon,
		info: 'Aqui você gerencia as cirurgias que já realizou e que ainda irá realizar',
		route: { name: 'UserSurgery' },
	},
];

export interface Route {
	name: string;
	screen?: string;
}
