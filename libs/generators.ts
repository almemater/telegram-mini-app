import crypto from "crypto";

export const generateReferralCode = (
  userId: string,
  username: string
): string => {
  const hash = crypto.createHash("sha256");
  hash.update(userId + username);
  const base64Hash = hash.digest("base64");
  const referralCode = base64Hash
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 6)
    .toUpperCase();
  return referralCode;
};

export const generateGameId = (userId: string, username: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(userId + username + Date.now().toString());
  const base64Hash = hash.digest("base64");
  const gameId = base64Hash
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 12)
    .toUpperCase();
  return gameId;
};

export const formatName = (name: string): string => {
  const isAlphanumeric = (char: string) => /^[a-z0-9]+$/i.test(char);

  const getFirstNAlphanumeric = (str: string, n: number) => {
    let result = "";
    let count = 0;
    for (let i = 0; i < str.length && count < n; i++) {
      result += str[i];
      if (isAlphanumeric(str[i])) {
        count++;
      }
    }
    return result;
  };

  const getLastNAlphanumeric = (str: string, n: number) => {
    let result = "";
    let count = 0;
    for (let i = str.length - 1; i >= 0 && count < n; i--) {
      result = str[i] + result;
      if (isAlphanumeric(str[i])) {
        count++;
      }
    }
    return result;
  };

  if (name.length <= 5) {
    return name;
  }

  const firstPart = getFirstNAlphanumeric(name, 3);
  const lastPart = getLastNAlphanumeric(name, 2);

  return `${firstPart}···${lastPart}`;
};
