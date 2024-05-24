"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ButtonRedirect() {
	const router = useRouter();

	const handleNavigate = () => {
		router.push("/login");
	};
	return <Button onClick={handleNavigate}>Qua trang Login</Button>;
}
