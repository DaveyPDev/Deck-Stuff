import React, { useState, useEffect } from 'react';
import useAuth from '../Auth/useAuth'; // Corrected import statement

const Profile = () => {
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          setDisplayName(currentUser.displayName || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [auth.currentUser]);

  const handleUpdateProfile = async () => {
    try {
      await user.updateProfile({
        displayName: displayName,
      });
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await user.updatePassword(newPassword);
      console.log('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <p>Email: {user ? user.email : 'Loading...'}</p>
        <label>
          Display Name:
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>
      <div>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;