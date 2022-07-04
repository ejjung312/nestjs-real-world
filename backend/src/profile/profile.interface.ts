export interface ProfileData {
  username: string;
  bio: string;
  image?: string; // optional
  following?: boolean;
}

export interface ProfileRO {
  profile: ProfileData;
}
