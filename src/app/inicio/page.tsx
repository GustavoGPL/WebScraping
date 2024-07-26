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
import { useMutation, useQuery } from '@tanstack/react-query';
import { SkeletonTable } from '@/components/skeleton-table';
import { queryClient } from '@/utils/react-query';

const formSchema = z.object({
	processNumber: z.string(),
});

const Inicio = () => {
	const [process, setProcess] = useState<TProcess[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			processNumber: '',
		},
	});

	const initFetch = useCallback(async () => {
		try {
			const app = await axios.get('http://localhost:8000/process');
			const processMaped = app.data.map((p: any) => p.processNumber);
			const requests = processMaped.map((pn: any) =>
				axios.get(`/processSearch?filter=${pn}`)
			);
			const responses = await Promise.all(requests);
			const proccesses = responses.map((res, index) => {
				const proccess = res.data;
				return {
					processNumber: processMaped[index],
					dataAction: proccess[0]?.dataAction || 'Sem informação',
					status: proccess[0]?.action || 'Sem informação',
					description: proccess[0]?.classeProcesso || 'Sem informação',
				};
			});

			// Remove duplications
			const uniqueProcesses = proccesses.filter(
				newProcess =>
					!process.some(
						existingProcess =>
							existingProcess.processNumber === newProcess.processNumber
					)
			);

			setProcess(prev => [...prev, ...uniqueProcesses]);
			return proccesses;
		} catch (err) {
			console.error(err);
		}
	}, [process]);

	const { isPending } = useQuery({
		queryKey: ['getAllProcess'],
		queryFn: initFetch,
		refetchInterval: 1800000,
		refetchOnWindowFocus: false,
	});

	const { mutate: processMutation } = useMutation({
		mutationFn: (aux: TProcess) =>
			axios.post('http://localhost:8000/process', {
				dataAction: aux.dataAction,
				processNumber: aux.processNumber,
				status: aux.status,
				description: aux.description,
			}),
		onSettled: () => {
			setIsSubmitting(false);
		},
		// onSuccess: () => {
		// 	return queryClient.invalidateQueries({ queryKey: ['getAllProcess'] });
		// },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		const res = await axios.get(
			`/processSearch?filter=${values.processNumber}`
		);

		const proccess = res.data;

		const aux = {
			dataAction: proccess[0]?.dataAction || 'Sem informação',
			processNumber: values.processNumber || 'Sem informação',
			status: proccess[0]?.action || 'Sem informação',
			description: proccess[0]?.classeProcesso || 'Sem informação',
		};

		// Check if the process already exists
		if (
			!process.some(
				existingProcess => existingProcess.processNumber === aux.processNumber
			)
		) {
			processMutation(aux);
			setProcess(prev => [...prev, aux]);
		} else {
			setIsSubmitting(false);
		}

		form.reset();
	}
	return (
		<section className="flex justify-center m-10">
			<Card className="flex w-[80%] shadow-lg">
				<CardContent className="w-full">
					<Card className="my-5 px-5">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8 mt-4"
							>
								<FormField
									control={form.control}
									name="processNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">
												Número do Processo:
											</FormLabel>
											<FormControl>
												<InputMask
													placeholder="digite o número do processo"
													mask="_______-__.____._.__.____"
													replacement={{ _: /\d/ }}
													className="w-full h-10 pl-4 flex border-[.5px] bg-[#F0F2F5] border-[#F0F2F5] rounded-full focus:outline-0"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex justify-end !mb-4">
									<Button type="submit" disabled={isSubmitting}>
										Enviar
									</Button>
								</div>
							</form>
						</Form>
					</Card>
					{isPending ? (
						<SkeletonTable />
					) : (
						<DataTable data={process} columns={columns} />
					)}
				</CardContent>
			</Card>
		</section>
	);
};

export default Inicio;
