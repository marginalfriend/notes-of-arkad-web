"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

type Profile = {
  id: string;
  name: string;
};

type ProfileContextType = {
  profiles: Profile[];
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile) => void;
  fetchProfiles: () => Promise<void>;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const authFetch = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await authFetch("/api/profile");
      if (response.ok) {
        const fetchedProfiles = await response.json();
        setProfiles(fetchedProfiles);

        // Set default profile if none is selected
        if (!currentProfile && fetchedProfiles.length > 0) {
          const storedProfileId = localStorage.getItem("currentProfileId");
          const defaultProfile =
            fetchedProfiles.find((p: Profile) => p.id === storedProfileId) ||
            fetchedProfiles[0];
          setCurrentProfile(defaultProfile);
          localStorage.setItem("currentProfileId", defaultProfile.id);
        }
      }

      if (response.status === 404) {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSetCurrentProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    localStorage.setItem("currentProfileId", profile.id);
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile: handleSetCurrentProfile,
        fetchProfiles,
        loading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
