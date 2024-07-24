'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { InputMask } from '@react-input/mask';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useCallback, useState } from 'react';
import { columns } from './columns';
import { TProcess } from '@/types/process';
// import { useQuery } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonTable } from '@/components/skeleton-table';

const formSchema = z.object({
	processNumber: z.string(),
});

const Inicio = () => {
	const [process, setProcess] = useState<TProcess[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			processNumber: '',
		},
	});

	const initFetch = useCallback(async () => {
		try {
			const app = await axios.get('http://localhost:8000/process');
			const processMapped = app.data.map((p: any) => p.processNumber);
			const res = await axios.get(`/processSearch?filter=${processMapped}`);
			const aux = [
				{
					processNumber: processMapped,
					status: res.data[0].action,
					description: res.data[0].classeProcesso,
				},
			];
			setProcess(aux);
		} catch (err) {
			console.error(err);
		}
	}, []);

	const { isPending } = useQuery({
		queryKey: ['getAllProcess'],
		queryFn: initFetch,
		refetchOnWindowFocus: false,
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await axios.get(
			`/processSearch?filter=${values.processNumber}`
		);

		const proccess = res.data;
		console.log('Process', proccess[0]);

		console.log('Process Formatted', values);

		const aux = {
			...values,
			status: proccess[0]?.action,
			description: proccess[0]?.classeProcesso,
		};
		setProcess(prev => [...prev, aux]);

		form.reset();
	}
	return (
		<section className="flex justify-center m-10">
			<Card className="flex w-[80%]">
				<CardContent className="w-full">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
							<FormField
								control={form.control}
								name="processNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número do Processo:</FormLabel>
										<FormControl>
											<InputMask
												placeholder="digite o número do processo"
												mask="_______-__.____._.__.____"
												replacement={{ _: /\d/ }}
												className="w-full flex border-[1px] border-black rounded-lg"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-end !mb-4">
								<Button type="submit">Enviar</Button>
							</div>
						</form>
						{isPending ? (
							<SkeletonTable />
						) : (
							<DataTable data={process} columns={columns} />
						)}
					</Form>
				</CardContent>
			</Card>
		</section>
	);
};

export default Inicio;
