import { Task } from "@/libs/types";

export const BestGameRecordTypes = {
    RECENT: 'recent',
    TIME: 'time',
    FLIPS: 'flips',
    HIGHSCORE: 'highScore',
}

// REWARD SYSTEM
export const rewardPoints = {
  followOnTwitter: 200,
  followOnLinkedIn: 200,
  joinTelegramGroup: 200,
  completeFeedback: 200,
  walletConnection: 500,
  premiumUser: 1000,
  referFriend: 500,
};

export const tasks: Task[] = [
  {
    id: 1,
    name: "Join our Telegram Channel",
    link: "https://t.me/AlmeMaterEdu",
    btn: "Join",
    points: rewardPoints.joinTelegramGroup,
  },
  {
    id: 2,
    name: "Follow us on Twitter",
    link: "https://x.com/almemater",
    btn: "Follow",
    points: rewardPoints.followOnTwitter,
  },
  {
    id: 3,
    name: "Follow us on Linkedin",
    link: "https://www.linkedin.com/company/almemater",
    btn: "Follow",
    points: rewardPoints.followOnLinkedIn,
  },
  {
    id: 4,
    name: "Share Your Feedback",
    link: "https://forms.gle/D2vx7ZvegpBKByvw6",
    btn: "Complete",
    points: rewardPoints.completeFeedback,
  }, 
];

export const walletConnectTask: Task = {
    id: 100,
    name: "",
    link:  "",
    btn: "",
    points: rewardPoints.walletConnection,
}

export const premiumUserTask: Task = {
  id: 101,
  name: "",
  link:  "",
  btn: "",
  points: rewardPoints.premiumUser,
}