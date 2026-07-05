export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  paternalSurname: string | null;
  maternalSurname: string | null;
  documentType: string | null;
  documentNumber: string | null;
  birthDate: string | null;
  nationality: string | null;
  sex: string | null;
  secondaryEmail: string | null;
  mobilePhone: string | null;
  secondaryPhoneType: string | null;
  secondaryPhone: string | null;
  contractType: string | null;
  contractDate: string | null;
}
