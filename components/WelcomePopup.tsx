import React, { useState } from "react";

interface WelcomePopupProps {
  onClose: () => void;
  onSubmit: (referralCode: string) => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose, onSubmit }) => {
  const [referralCode, setReferralCode] = useState("");

  const handleSubmit = () => {
    onSubmit(referralCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-black">
        <h2 className="text-xl mb-4">Welcome to Our App!</h2>
        <p className="mb-4">We're glad to have you here.</p>
        <input
          type="text"
          placeholder="Enter referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;