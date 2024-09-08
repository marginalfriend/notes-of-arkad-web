import React from "react";
import { useProfile } from "@/contexts/profile-context";

export const ProfileSelector: React.FC = () => {
  const { profiles, currentProfile, setCurrentProfile } = useProfile();

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfile = profiles.find(p => p.id === event.target.value);
    if (selectedProfile) {
      setCurrentProfile(selectedProfile);
    }
  };

  if (!currentProfile) return null;

  return (
    <select value={currentProfile.id} onChange={handleProfileChange}>
      {profiles.map(profile => (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      ))}
    </select>
  );
};
