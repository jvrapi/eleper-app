export interface Auth {
  username: string;
  password: string;
}

export interface NewUser {
  name: string;
  email: string;
  cpf: string;
  birth: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface StorageData {
  user: User;
  token: string;
}

export interface RedefinePassword {
  email: string;
  code: string;
  password: string;
}
