import { pageIcons } from '../assets/icons';

export const homeOptions = [
  {
    title: 'Meu registro',
    icon: pageIcons.myRecordIcon,
    info: 'Aqui você verá um resumo do seu registro pessoal.',
    route: { name: 'Profile', screen: 'MyRecord' },
  },
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

  /* {
    title: 'Meu Historico Familiar',
    icon: pageIcons.familyHistoryIcon,
    info: 'Para deixar seu historico mais completo, informe doenças que estão ou que estiveram presente na familia',
    route: { name: 'Disease' },
  }, */
  {
    title: 'Minhas internações',
    icon: pageIcons.familyHistoryIcon,
    info: 'Complete seu histórico me informando suas internações hospitalares',
    route: { name: 'Hospitalization' },
  },
  {
    title: 'Minhas Cirurgias',
    icon: pageIcons.familyHistoryIcon,
    info: 'Aqui você gerencia as cirurgias que já realizou e que ainda irá realizar',
    route: { name: 'Hospitalization' },
  },
];

export interface Route {
  name: string;
  screen?: string;
}
