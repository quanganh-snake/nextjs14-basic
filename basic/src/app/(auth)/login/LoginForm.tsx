"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import envConfig from "@/config";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useTokenApp } from "@/app/contexts/AppProvider";
import authApiRequest from "@/apiRequest/auth.api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const router = useRouter();
	const { toast } = useToast();
	const { setSessionToken } = useTokenApp();
	const form = useForm<LoginBodyType>({
		resolver: zodResolver(LoginBody),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginBodyType) {
		try {
			// const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/auth/login`, {
			// 	method: "POST",
			// 	body: JSON.stringify(values),
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// }).then(async (res) => {
			// 	const metadata = await res.json();
			// 	const payload = {
			// 		status: res.status,
			// 		metadata,
			// 	};

			// 	if (!res.ok) {
			// 		throw payload;
			// 	}
			// 	return payload;
			// });
			const result = await authApiRequest.login(values);
			toast({
				title: result.payload.message,
			});
			// const resNextServer = await fetch("/api/auth", {
			// 	method: "POST",
			// 	body: JSON.stringify(result),
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// }).then(async (res) => {
			// 	return res.json();
			// });
			await authApiRequest.auth({ sessionToken: result.payload.data.token });
			// console.log("🚀 ~ file: LoginForm.tsx:52 ~ onSubmit ~ resNextServer:", resNextServer);
			setSessionToken(result.payload.data.token);
			router.push("/profile");
		} catch (error: any) {
			console.log(error);
			const errors = error.metadata.errors as { field: string; message: string }[];
			const status = error.status as number;
			if (status === 422) {
				errors.forEach(({ field, message }) => {
					form.setError(field as "email" | "password", {
						type: "server",
						message: message,
					});
				});
			} else {
				toast({
					variant: "destructive",
					title: "Error!",
					description: error.payload.message,
				});
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate={true}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* END: Email */}

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* END: Password */}

				<Button type="submit">Đăng nhập</Button>
			</form>
		</Form>
	);
}
