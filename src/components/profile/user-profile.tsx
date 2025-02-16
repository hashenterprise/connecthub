import React from 'react';

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // Fetch user data based on userId
  // For demonstration purposes, we'll use a placeholder
  const user = {
    id: userId,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;