import { Disease } from './disease';
import { Medicine } from './medicine';

interface DefaultFields {
	amount: string;
	instruction: string;
	beginDate: string;
	endDate: string | null;
}
export interface Save extends DefaultFields {
	userDiseaseId: string;
	userId: string;
	medicineId: string;
}

export interface UserMedicine {
	id: string;
	medicine: Medicine;
	disease: Disease;
	amount: string;
	instruction: string;
	beginDate: string;
	endDate: string;
}

export interface Update {
	id: string;
	amount: string;
	instruction: string;
	beginDate: string;
	endDate: string | null;
	userDiseaseId: string;
	medicineId: string;
}

export interface UserMedicineDetails extends DefaultFields {
	id: string;
	userDiseaseId: string;
	disease: {
		id: string;
		name: string;
	};
	medicine: {
		id: string;
		name: string;
	};
}

export type DataSaved = Update;
