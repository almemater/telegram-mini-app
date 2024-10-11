export interface TGUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username: string;
  language_code: string;
  is_premium?: boolean;
}

export interface UserData extends TGUserData {
  completedTasks: number[];
  referralCode: string;
  referrals: string[];
}

export interface PointsData {
  id: number;
  full_name: string;
  username: string;
  points: number;
}

export interface MemoryGameRecord {
  gameId: string;
  userId: string;
  score: number;
  timeTaken: number;
  flips: number;
  isWin: boolean;
}

export interface Task {
  id: number;
  name: string;
  link: string;
  btn: string;
  points: number;
}

export const sampleUserData: UserData = {
  id: 123456,
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  language_code: "en",
  is_premium: false,
  completedTasks: [],
  referralCode: "ABC123",
  referrals: [],
};

export interface PointsUpdatePopupProps {
  message: string;
  points: number;
  buttonText: string;
  onClose: () => void;
  positive?: boolean;
}