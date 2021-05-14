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
];

export interface Route {
  name: string;
  screen?: string;
}
