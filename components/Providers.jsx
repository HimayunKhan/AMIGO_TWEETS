"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);


const Providers = ({children}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;