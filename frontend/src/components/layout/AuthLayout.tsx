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
    const authFailure = sessionStorage.getItem('authFailure');
    const isPublicPage = pathname && publicRoutes.includes(pathname);
    const isProtectedPage = pathname && !publicRoutes.includes(pathname);

    // If auth failed and we are on signin page
    // DO NOT redirect back to home
    // Just clear the flag and show signin
    if (authFailure && isPublicPage) {
      sessionStorage.removeItem('authFailure');
      stopLoading();
      return; // Stay on signin page
    }

    // Normal case: logged in user visits signin
    // Redirect them home
    if (hasAccessToken && isPublicPage && !authFailure) {
      router.push(routes.HOME);
      stopLoading();
      return;
    }

    // Not logged in and on protected page
    // Redirect to signin
    if (!hasAccessToken && isProtectedPage) {
      message.error("Login to continue!");
      router.push(routes.INITIAL);
      stopLoading();
      return;
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
