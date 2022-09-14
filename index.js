const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
		defaultViewport: {
			width: 1370,
			height: 768
		},
		headless: false
	});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://www.hamburgsud.com/en/ecommerce/visibility/track-and-trace/');

	try{

		await page.waitForSelector('#cmpwrapper');
    let test;
		await page.evaluate(() => {

			let modal = document.querySelector('#cmpwrapper').shadowRoot.querySelector('#cmpbox');
			let btnAccept = modal.querySelector('#cmpbntyestxt');
			btnAccept.click();

			return btnAccept.outerHTML;
		});

    let frameHandle = await page.$('iframe[src="https://www.hamburgsud.com/linerportal/pages/hsdg/tnt.xhtml?lang=en"]');
		let frame = await frameHandle.contentFrame();
		let textArea = await frame.$('body main textarea#j_idt6\\:searchForm\\:j_idt8\\:inputReferences');
		let submitBtn = await frame.$('button#j_idt6\\:searchForm\\:j_idt8\\:search-submit');
		await textArea.type('HASU5073623');

		submitBtn.click();

		await frame.waitForSelector('#j_idt6\\:searchForm\\:j_idt39\\:containerDetails');
		let dataBox = await frame.$('#j_idt6\\:searchForm\\:j_idt39\\:containerDetails');
		let dataDiv = await dataBox.$('#j_idt6\\:searchForm\\:j_idt39\\:j_idt43_content');
		let dataCols = await dataDiv.$$('div.ui-g');
		let dataRows;
    let title;
    let date;

		for(let col of dataCols){

			dataRows = await col.$$('div');

			for(let row of dataRows){

        titleTag = await row.$('span');
				title = await frame.evaluate(titleTag => titleTag.innerHTML, titleTag);
        if(title == 'VGM received'){

          let brPosition;
          rawData = await frame.evaluate(row => row.innerHTML, row);
          brPosition = rawData.search('<br>');
          date = rawData.substring(brPosition + 4, rawData.length);
          console.log(date);
        }
			}
		}

		await dataBox.hover();

		let mainContainer = await frame.$('#j_idt6\\:searchForm\\:j_idt39\\:mainContainerInformation');
		let mainTable = await mainContainer.$('table');
		let lastRow = await mainTable.$('tbody tr:last-child');
		let lastRowCols = await lastRow.$$('td');
		let data = [];

		for(let [i, col] of lastRowCols.entries()){

			if(i == 0){

				let lastSpan = await col.$('span:last-child');
				let text = await frame.evaluate(lastSpan => lastSpan.innerHTML, lastSpan);
				data.push(text);
			}else{

				let rawText = await frame.evaluate(col => col.innerHTML, col);
				let spanTagPosition = rawText.search('</span>');
				let text = rawText.substring(spanTagPosition + 7, rawText.length);
				data.push(text);
			}
		}

		console.log(data);
	}catch(e){

		console.log('not found', e);
	}

	setTimeout(async() => {

		await page.screenshot({path: 'example.png'});
		await browser.close();
	}, 1000);
})();
