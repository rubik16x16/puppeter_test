const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
		defaultViewport: {
			width: 1370,
			height: 768
		},
		// headless: false
	});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://www.apl.com/ebusiness/tracking');

	// console.log(test);
	try{

		await page.waitForSelector('input#Reference');
		let inputBox = await page.$('input#Reference');
		await inputBox.type('CMAU6221446');
		let btnSearch = await page.$('button#btnTracking');
		await btnSearch.click();
		await page.waitForNavigation({waituntil: 'domcontentloaded'});
		let dataBox = await page.$('div#gridTrackingDetails div.k-grid-content');
		let dataTable = await dataBox.$('table');
		let rows = await dataTable.$$('tbody tr');
		let data = [];

		for(let row of rows){

			let move = await row.$('td:nth-child(2) span');
			let moveText = await page.evaluate(move => move.innerHTML, move);
			data.push(moveText);
		}

		console.log(data);
	}catch(e){

		console.log('not found', e);
	}

	await page.screenshot({path: 'example.png'});
	await browser.close();

})();
