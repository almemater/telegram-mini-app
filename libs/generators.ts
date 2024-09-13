import crypto from 'crypto';

export const generateReferralCode = (userId: string, username: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(userId + username);
  const base64Hash = hash.digest('base64');
  const referralCode = base64Hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
  return referralCode;
};

export const generateGameId = (userId: string, username: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(userId + username + Date.now().toString());
  const base64Hash = hash.digest('base64');
  const gameId = base64Hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12).toUpperCase();
  return gameId;
};