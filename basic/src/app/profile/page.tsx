import envConfig from "@/config";
import { cookies } from "next/headers";
import ProfileView from "@/app/profile/Profile";
import profileApiRequest from "@/apiRequest/profile.api";
export default async function ProfilePage() {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get("sessionToken");

	// const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/account/me`, {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: `Bearer ${sessionToken?.value}`,
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

	// console.log(result);
	const result = await profileApiRequest.me((sessionToken?.value as string) || "");

	return (
		<>
			<h1>Server Component: {result.payload.data.name}</h1>
			<ProfileView />
		</>
	);
}
