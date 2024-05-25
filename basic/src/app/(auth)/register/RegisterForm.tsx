"use client";
import authApiRequest from "@/apiRequest/auth.api";
// import { useTokenApp } from "@/app/contexts/AppProvider";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import envConfig from "@/config";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
	const router = useRouter();
	// const { setSessionToken } = useTokenApp();
	const form = useForm<RegisterBodyType>({
		resolver: zodResolver(RegisterBody),
		defaultValues: {
			email: "",
			name: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: RegisterBodyType) {
		// const res = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/auth/register`, {
		// 	method: "POST",
		// 	body: JSON.stringify(values),
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// }).then((res) => res.json());

		// console.log(res);
		try {
			const result = await authApiRequest.register(values);
			toast({
				title: result.payload.message,
			});
			// setSessionToken(result.payload.data.token);
			clientSessionToken.value = result.payload.data.token;
			router.push("/login");
		} catch (error: any) {
			handleErrorApi({ error, setError: form.setError, duration: 2000 });
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* END: Name */}
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Confirm Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* END: Confirm Password */}
				<Button type="submit">Đăng ký</Button>
			</form>
		</Form>
	);
}
