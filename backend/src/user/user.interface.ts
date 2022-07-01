export interface UserData {
  username: string;
  email: string;
  token: string;
  bio: string;
  image?: string; // optional
}

export interface UserRO {
  user: UserData;
}
