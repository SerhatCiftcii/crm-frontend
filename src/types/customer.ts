// src/types/customer.ts

export interface CustomerDto {
  id: number;
  companyName: string;
  branchName?: string;
  ownerName: string;
  phone?: string;
  email: string;
  city?: string;
  district?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  webSite?: string;
salesDate: string | null; // null olabilir
  status: number;
  products?: ProductDto[];
}

export interface CreateCustomerDto {
  companyName: string;
  branchName?: string;
  ownerName: string;
  phone?: string;
  email: string;
  city?: string;
  district?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  webSite?: string;
  salesDate: string | null; // null olabilir
  status: number;
  productIds?: number[];
}

export interface UpdateCustomerDto {
  id: number;
  companyName: string;
  branchName?: string;
  ownerName: string;
  phone?: string;
  email: string;
  city?: string;
  district?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  webSite?: string;
    salesDate: string | null;
  status: number;
  productIds?: number[];
}

export interface ProductDto {
  id: number;
  name: string;
}

// Yeni eklenen: CustomerChangeLogDto
export interface CustomerChangeLogDto {
  id: number;
  customerId: number;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedAt: string; // ISO string
}
