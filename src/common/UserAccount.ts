export interface UserAccount {
  userId: string;
  userName: string;
  email: string;
  displayName: string;
  passwordExpiredTime: Date;
  token: string;
  tokenExpiredDate: Date;
  newUser: boolean;
}
