import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TProcess = {
	processNumber: string;
	status: string;
	description: string;
};

export const columns: ColumnDef<TProcess>[] = [
	{
		accessorKey: 'processNumber',
		header: 'Número',
		cell: ({ row }) => {
			return <td className="w-[500px]">{row.getValue('processNumber')}</td>;
		},
	},
	{
		accessorKey: 'description',
		header: 'Classe',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return <td className="w-[800px]">{row.getValue('status')}</td>;
		},
	},
	{
		header: 'Detalhamento',
		cell: ({ row }) => {
			const pNumber = row.getValue('processNumber');
			console.log('Pnumber', pNumber);
			return (
				<div className="w-50%">
					<Dialog>
						<DialogTrigger asChild className="hover:cursor-pointer">
							<VisibilityOutlinedIcon fontSize="medium" />
						</DialogTrigger>
						<DialogContent className="sm:max-w-[50%]">
							<DialogHeader>
								<DialogTitle>
									Detalhes do Processo -{' '}
									<Link
										target="_blank"
										href={`https://esaj.tjce.jus.br/cpopg/show.do?processo.foro=1&processo.numero=${pNumber}`}
										className="hover:underline hover:text-blue-600"
									>
										{row.getValue('processNumber')}
									</Link>
								</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click save when you're
									done.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button type="submit">Ok</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			);
		},
	},
];
