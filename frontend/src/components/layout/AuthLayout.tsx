"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routes } from "../../routes";
import { message, Row, Spin } from "antd";
import { useAuthQuery } from "../../features/auth";
import { Cache } from "../../services/api/cache";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { user } = useAuthQuery();
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = [routes.SIGNUP, routes.SIGNIN, routes.INITIAL];

  const stopLoading = () => {
    setTimeout(() => setIsAuthenticating(false), 1000);
  };

  useEffect(() => {
    const hasAccessToken = Cache.checkItem("accessToken");
    if (hasAccessToken && pathname && publicRoutes.includes(pathname)) {
      router.push(routes.HOME);
    } else if (!hasAccessToken && pathname && !publicRoutes.includes(pathname)) {
      message.config({ maxCount: 1 });
      message.error("Login to continue!");
      router.push(routes.INITIAL);
    }
    stopLoading();
  }, [pathname]);

  if (isAuthenticating)
    return (
      <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
        <Spin>
          <span>Authenticating...</span>
        </Spin>
      </Row>
    );
  
  return <>{children}</>;
};

export default AuthLayout;
