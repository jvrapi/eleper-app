import { Disease } from './disease';

interface DefaultFields {
	description: string;
	userId: string;
	diseaseId?: string;
}

export interface Annotation extends DefaultFields {
	id: string;
	createdAt: string;
	disease: Disease;
}

export type Save = DefaultFields;

export interface Update extends DefaultFields {
	id: string;
}
