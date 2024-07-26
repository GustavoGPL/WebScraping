import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
	let browser;
	try {
		const url = new URL(request.url);
		const filtro = url.searchParams.get('filter') || '';
		console.log('Filtro', filtro);
		browser = await puppeteer.launch();
		const page = await browser.newPage();
		// await page.goto(
		// 	`https://esaj.tjce.jus.br/cpopg/search.do?paginaConsulta=${pageIndex}&conversationId=&cbPesquisa=NMADVOGADO&dadosConsulta.valorConsulta=Lucas+Espinola+Arruda&cdForo=-1`
		// );
		await page.goto(
			`https://esaj.tjce.jus.br/cpopg/show.do?processo.foro=1&processo.numero=${filtro}`
		);
		const html = await page.content(); //get the entire html content
		const $ = cheerio.load(html); //load the html content

		const date = $('tbody#tabelaTodasMovimentacoes td.dataMovimentacao')
			.map((index, element) => {
				return $(element).text().replace(/\n|\t/g, '').trim();
			})
			.get();

		const actions = $('td.descricaoMovimentacao')
			.map((index, element) => {
				return $(element).text().replace(/\n|\t/g, '').trim();
			})
			.get();

		const classe = $('span#classeProcesso')
			.map((index, element) => {
				return $(element).text().replace(/\n|\t/g, '').trim();
			})
			.get();

		// const proccessNumbers = $("a.linkProcesso")
		// 	.map((index, element) => {
		// 		return $(element).text().replace(/\n|\t/g, '').trim();
		// 	})
		// 	.get();

		// const lawyers = $("div.unj-base-alt")
		// 	.map((index, element) => {
		// 		return $(element).text().replace(/\n|\t/g, '').trim();
		// 	})
		// 	.get();

		// const proccessClass = $("div.classeProcesso")
		// 	.map((index, element) => {
		// 		return $(element).text().replace(/\n|\t/g, '').trim();
		// 	})
		// 	.get();

		// const mainSubjectProccess = $("div.assuntoPrincipalProcesso")
		// 	.map((index, element) => {
		// 		return $(element).text().replace(/\n|\t/g, '').trim();
		// 	})
		// .get();

		// const receivedIn = $("div.dataLocalDistribuicaoProcesso")
		// 	.map((index, element) => {
		// 		return $(element).text().replace(/\n|\t/g, '').trim();
		// 	})
		// 	.get();
		// const imageUrls = $("img.s-image")
		// 	.map((index, element) => {
		// 		return $(element).attr("src");
		// 	})
		// 	.get();

		const data = [];

		for (let i = 0; i < date.length; i++) {
			const item = {
				// price: prices[i],
				// proccessNumber: proccessNumbers[i],
				// lawyer: lawyers[i],
				// classProccess: proccessClass[i],
				// mainProccess: mainSubjectProccess[i],
				// received: receivedIn[i]
				// review: reviews[i],
				// imageUrl: imageUrls[i],
				dataAction: date[i],
				action: actions[i],
				classeProcesso: classe[i],
			};
			data.push(item);
		}

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 200 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
