export interface AuthorizedPersonDto {
  id: number;
  customerId: number;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  birthDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // ekstra: backend Include yaptıysa CompanyName de gelebilir
  customerName?: string;
}

export interface CreateAuthorizedPersonDto {
  customerId: number;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  birthDate?: string;
  notes?: string;
}

export interface UpdateAuthorizedPersonDto extends CreateAuthorizedPersonDto {
  id: number;
}
