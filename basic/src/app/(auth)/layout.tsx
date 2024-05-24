import React from "react";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="w-[500px]">{children}</div>
		</main>
	);
}
