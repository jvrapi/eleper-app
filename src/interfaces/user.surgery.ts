import { Hospitalization } from './hospitalization';
import { Surgery } from './surgery';

export interface UserSurgery {
	id: string;
	surgery: Surgery;
	hospitalization: Hospitalization;
}

interface DefaultFields {
	userId: string;
	hospitalization: Hospitalization;
	afterEffects: string;
}

export interface Save extends DefaultFields {
	surgery: string;
}

export interface Update extends DefaultFields {
	id: string;
	surgeryId: string;
}
