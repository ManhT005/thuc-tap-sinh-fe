export interface ReqresUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqresUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqresUser[];
}

export interface CreateUserResponse {
  id: string;
  createdAt: string;
}

export interface UpdateUserResponse {
  updatedAt: string;
}