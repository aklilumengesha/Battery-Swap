"use client";

import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuthQuery } from "../../features/auth";
import { Button } from "../../components";

const Profile = () => {
  const { user, signout } = useAuthQuery();

  const handleLogout = () => {
    signout();
  };

  return (
    <DashboardLayout title="Profile">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="text-lg font-semibold">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-semibold">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">User Type</p>
            <p className="text-lg font-semibold capitalize">{user?.user_type}</p>
          </div>
          <Button
            type="solid"
            className="w-full mt-6"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
