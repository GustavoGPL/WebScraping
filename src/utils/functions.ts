export const functions = {
	processMask: (value: string) => {
		const auxProcessMasked = value
			.replace(/\D/g, '') // Remove qualquer caractere que não seja número
			.replace(/(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6');
		return auxProcessMasked;
	},
};
