export const passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export interface IRegisterUser {
  displayName: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  country: string;
}

export interface IAuthResult {
  message: string;
  token: string;
  refreshTokenExpiresOn: string;
}

export interface ILoginUser {
  userNameOrEmail: string;
  password: string;
}

export interface IJwtTokenPayload {
  jti: string;
  iat: number;
  sub: string;
  unique_name: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  iss: string;
  aud: string;
}

export interface IJwtPayload {
  jti: string;
  iat: number;
  sub: string;
  unique_name: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  iss: string;
  aud: string[] | string;
}

export interface IUserShippingAddress {
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  country: string;
}

export interface IUserInfoResult {
  userId: string;
  userName: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  pictureUrl: string | null;
  address: Address;
}

export interface IBasicInfoOptions {
  displayName: string;
  phoneNumber: string;
  address: Address;
  avatar: FormData | null;
}

export interface IChangePasswordOptions {
  currentPassword: string;
  newPassword: string;
}

export interface IRequestEmailChangeOptions {
  newEmail: string;
  password: string;
}
