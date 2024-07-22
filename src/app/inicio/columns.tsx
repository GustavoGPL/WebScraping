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
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'description',
		header: 'Descricação',
	},
	{
		header: 'Detalhamento',
		cell: ({ row }) => {
			return (
				<div className="w-50%">
					<Dialog>
						<DialogTrigger asChild className="hover:cursor-pointer">
							<VisibilityOutlinedIcon fontSize="medium" />
						</DialogTrigger>
						<DialogContent className="sm:max-w-[50%]">
							<DialogHeader>
								<DialogTitle>
									Detalhes do Processo - {row.getValue('processNumber')}
								</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click save when you're
									done.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button type="submit">Fechar</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			);
		},
	},
];
