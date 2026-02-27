"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { routes } from "../routes";
import { message, Row, Spin } from "antd";
import { authActions } from "../redux/auth";
import { Cache } from "../../infrastructure/common/cache";

const AuthLayout = ({ children, location }: any) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = [routes.SIGNUP, routes.SIGNIN, routes.INITIAL];

  const stopLoading = () => setTimeout(() => setIsAuthenticating(false), 1000);

  useEffect(() => {
    const hasAccessToken = Cache.checkItem("accessToken");
    if (hasAccessToken && publicRoutes.includes(pathname)) {
      router.push(routes.HOME);
    } else if (!hasAccessToken && !publicRoutes.includes(pathname)) {
      message.config({ maxCount: 1 });
      message.warn("Login to continue!");
      router.push(routes.INITIAL);
    } else {
      dispatch(authActions.handleSetUser(Cache.getItem("user")) as any);
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
