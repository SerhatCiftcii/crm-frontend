export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
}
