// src/types/maintenance.ts

import type { ProductDto } from "./product";

// Mevcut API yanıtına uygun olarak
export interface MaintenanceDto {
  id: number;
  customerId: number;
  customerName: string;
  subject: string;
  startDate: string; // YENİ: Başlangıç Tarihi
  endDate: string; // YENİ: Bitiş Tarihi
  passportCreatedDate?: string; // YENİ: Pasaport Oluşturma Tarihi
  offerStatus: string; // YENİ: Teklif Durumu (string olarak geliyor)
  contractStatus: string; // YENİ: Sözleşme Durumu 
  licenseStatus: string; // YENİ: Lisans Durumu 
  firmSituation: string; // YENİ: Firma Durumu 
  products: ProductDto[]; // YENİ: Ürünle
  description?: string;
}

// Yeni kayıt oluşturmak için
export interface CreateMaintenanceDto {
  customerId: number;
  subject: string;
  startDate: string;
  endDate: string;
  passportCreatedDate?: string;
  offerStatus: number;
  contractStatus: number;
  licenseStatus: number;
  firmSituation: number;
  description?: string;
  productIds: number[]; // YENİ: Ürün ID'leri
}

// Kayıt güncellemek için
export interface UpdateMaintenanceDto extends CreateMaintenanceDto {
  id: number;
}