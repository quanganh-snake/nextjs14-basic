"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import profileApiRequest from "@/apiRequest/profile.api";

type Profile = AccountResType["data"];

export default function ProfileForm({ profile }: { profile: Profile }) {
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<UpdateMeBodyType>({
		resolver: zodResolver(UpdateMeBody),
		defaultValues: {
			name: profile.name,
		},
	});

	async function onSubmit(values: UpdateMeBodyType) {
		try {
			const result = await profileApiRequest.update(values);
			toast({
				title: result.payload.message,
			});
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error, setError: form.setError, duration: 2000 });
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate={true}>
				<FormLabel>Email</FormLabel>
				<FormControl>
					<Input type="email" placeholder="Email" value={profile.email} readOnly={true} disabled={true} />
				</FormControl>
				{/* END: Email */}

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* END: Password */}

				<Button type="submit">Cập nhật</Button>
			</form>
		</Form>
	);
}
