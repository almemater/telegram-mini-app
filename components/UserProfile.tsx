import { UserData } from '@/types';

interface UserProfileProps {
  userData: UserData;
  points: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, points }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md mb-4">
      <h2 className="text-2xl font-bold mb-2">Welcome Back, {userData.first_name} {userData.last_name}</h2>
      <ul className="mb-4">
        <li>ID: {userData.id}</li>
        <li>@{userData.username || 'N/A'}</li>
      </ul>
      <h2 className="text-xl font-bold mb-4 text-yellow-500">Points: {points}</h2>
    </div>
  );
};

export default UserProfile;