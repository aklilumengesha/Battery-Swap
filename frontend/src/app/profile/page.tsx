"use client";

import React, { useEffect, useState } from "react";
import { BarLayout } from "../../layouts";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../redux/auth";
import { Button } from "../../components";
import { getLocation } from "../../utils/location";

const Profile = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [location, setLocation] = useState<any>({ name: "loading..." });

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if ("geolocation" in navigator) {
      getLocation((data: any) => setLocation(data));
    }
  }, []);

  const handleLogout = () => {
    dispatch(authActions.handleSignout() as any);
  };

  return (
    <BarLayout location={location}>
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
    </BarLayout>
  );
};

export default Profile;
