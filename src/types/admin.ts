export interface AdminListDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  isSuperAdmin: boolean;
}

export interface AddAdminDto {
  username: string;
  email: string;
  fullName: string;
  password: string;
  phoneNumber?: string;
}

export interface AdminStatusUpdateDto {
  userId: string;
  isActive: boolean;
}
