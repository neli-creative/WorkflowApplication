export interface JwtPayload {
  userId: string;
  [key: string]: any;
}

export interface UserInRequest {
  userId: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
}
