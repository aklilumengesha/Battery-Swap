"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routes } from "../../routes";
import { message, Row, Spin } from "antd";
import { useAuth } from "../../features/auth";
import { Cache } from "../../services/api/cache";

const AuthLayout = ({ children, location }: any) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = [routes.SIGNUP, routes.SIGNIN, routes.INITIAL];

  const stopLoading = () => setTimeout(() => setIsAuthenticating(false), 1000);

  useEffect(() => {
    const hasAccessToken = Cache.checkItem("accessToken");
    if (hasAccessToken && pathname && publicRoutes.includes(pathname)) {
      router.push(routes.HOME);
    } else if (!hasAccessToken && pathname && !publicRoutes.includes(pathname)) {
      message.config({ maxCount: 1 });
      message.error("Login to continue!");
      router.push(routes.INITIAL);
    } else {
      const user = Cache.getItem("user");
      if (user) {
        setUser(user);
      }
    }
    stopLoading();
  }, [pathname]);

  if (isAuthenticating)
    return (
      <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
        <Spin tip="Authenticating..." />
      </Row>
    );
  
  return <>{React.cloneElement(children as React.ReactElement, { location })}</>;
};

export default AuthLayout;
