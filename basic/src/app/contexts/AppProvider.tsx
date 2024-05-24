"use client";

import { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const AppContext = createContext({
	sessionToken: "",
	setSessionToken: (value: string) => {},
});

export const useTokenApp = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("useTokenApp must be used within AppProvider");
	const { sessionToken, setSessionToken } = context;
	return { sessionToken, setSessionToken };
};

export default function AppProvider({ children, inititalSessionToken }: { children: React.ReactNode; inititalSessionToken: string }) {
	const [sessionToken, setSessionToken] = useState<string>(inititalSessionToken);

	return <AppContext.Provider value={{ sessionToken, setSessionToken }}>{children}</AppContext.Provider>;
}
