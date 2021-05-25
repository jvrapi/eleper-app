import { Hospitalization } from './hospitalization';
import { Surgery } from './surgery';

export interface UserSurgery {
	id: string;
	surgery: Surgery;
	hospitalization: Hospitalization;
}

interface UserSurgeryHospitalization {
	id?: string;
	entranceDate: string;
	exitDate?: string;
	location: string;
	reason: string;
}

interface DefaultFields {
	userId: string;
	hospitalization: UserSurgeryHospitalization;
	afterEffects: string;
}

export interface Save extends DefaultFields {
	surgeryId: string;
}

export interface Update extends DefaultFields {
	id: string;
	surgery: Surgery;
}
