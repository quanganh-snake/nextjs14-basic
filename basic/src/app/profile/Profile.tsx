"use client";

import profileApiRequest from "@/apiRequest/profile.api";
// import { useTokenApp } from "@/app/contexts/AppProvider";
import envConfig from "@/config";
import { clientSessionToken } from "@/lib/http";
import { useEffect } from "react";

export default function ProfileView() {
	// const { sessionToken } = useTokenApp();

	useEffect(() => {
		const fetchData = async () => {
			// const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/account/me`, {
			// 	method: "GET",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		Authorization: `Bearer ${clientSessionToken.value}`,
			// 	},
			// }).then(async (response) => {
			// 	const metadata = await response.json();
			// 	const payload = {
			// 		status: response.status,
			// 		metadata,
			// 	};

			// 	if (!response.ok) {
			// 		throw payload;
			// 	}

			// 	return payload;
			// });
			const result = await profileApiRequest.meClient();

			console.log(result);
		};
		fetchData();
	}, []);

	return <div>Profile View</div>;
}
