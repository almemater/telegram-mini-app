import React from "react";

interface RewardEligibilityPopupProps {
  onClose: () => void;
  eligibilityMessage: string;
  referrals: { id: string; first_name: string; username: string }[];
}

const RewardEligibilityPopup: React.FC<RewardEligibilityPopupProps> = ({
  onClose,
  eligibilityMessage,
  referrals,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="glassmorphic-tertiary p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-xl mb-4">Reward Eligibility</h2>
        <p className="mb-4">{eligibilityMessage}</p>
        {referrals.length > 0 && (
          <ul className="mb-4">
            {referrals.map((user) => (
              <li key={user.id}>
                {user.first_name} (@{user.username})
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RewardEligibilityPopup;