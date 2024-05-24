import envConfig from "@/config";
import React from "react";
import { cookies } from "next/headers";
export default async function Profile() {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get("sessionToken");

	// console.log("🚀 ~ file: page.tsx:8 ~ Profile ~ sessionToken:", sessionToken);

	const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/account/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${sessionToken?.value}`,
		},
	}).then(async (response) => {
		const metadata = await response.json();
		const payload = {
			status: response.status,
			metadata,
		};

		if (!response.ok) {
			throw payload;
		}

		return payload;
	});

	console.log(result);

	return <div>Profile</div>;
}
