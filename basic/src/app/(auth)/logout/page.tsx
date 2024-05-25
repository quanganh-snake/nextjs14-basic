"use client";

import authApiRequest from "@/apiRequest/auth.api";
import { clientSessionToken } from "@/lib/http";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const sessionToken = searchParams.get("sessionToken");

	useEffect(() => {
		if (sessionToken === clientSessionToken.value) {
			authApiRequest.logoutFromNextClientToNextServer(true).then((_) => {
				router.push("/login");
			});
		}

		return () => {
			clientSessionToken.value = "";
		};
	}, [sessionToken]);

	return <div>page</div>;
}
