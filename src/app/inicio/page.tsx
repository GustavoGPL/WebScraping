'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { InputMask } from '@react-input/mask';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useState } from 'react';
import { columns } from './columns';
import { TProcess } from '@/types/process';

const formSchema = z.object({
	processNumber: z.string(),
});

const Inicio = () => {
	const [process, setProcess] = useState<TProcess[]>([]);
	// const [isOpenModal, setIsOpenModal] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			processNumber: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// const res = await fetch(`/processSearch?filter=${values.processNumber}`, {
		// 	method: 'GET',
		// });

		// const proccess = await res.json();
		// console.log('Process', proccess);

		console.log('Process Formatted', values);
		const aux = {
			...values,
			status: 'teste',
			description: 'kdfjsdhfksjdfhskdjfh',
		};
		setProcess(prev => [...prev, aux]);
		form.reset();
	}
	return (
		<section className="flex justify-center m-10">
			<Card className="flex w-[60%]">
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
						<DataTable data={process} columns={columns} />
					</Form>
				</CardContent>
			</Card>
		</section>
	);
};

export default Inicio;
