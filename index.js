const ppt = require("puppeteer");
const { writeCSV } = require("./utils");

ppt
  .launch({ headless: false })
  .then(async (browser) => {
    const url = "https://coinmarketcap.com";
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // grab the table
    const table = await page.$("table.cmc-table");
    const rows = await table.$$("tbody tr");

    const data = [];

    for (let i = 0; i < rows.length; i++) {
      await page.click(`table.cmc-table tbody tr:nth-child(${i + 1})`);
      const row = await page.$(`table.cmc-table tbody tr:nth-child(${i + 1})`);
      const tds = await row.$$("td");
      // grab the coin details
      const name = await tds[2].$eval(
        "p:nth-child(1)",
        (node) => node.innerText
      );

      const abbv = await tds[2].$eval(
        "p:nth-child(2)",
        (node) => node.innerText
      );

      const price = await tds[3].$eval("*", (node) => node.innerText);
      const marketCap = await tds[5].$eval("*", (node) => node.innerText);
      const volume = await tds[6].$eval("*", (node) => node.innerText);

      data.push({ name, abbv, price, "market cap": marketCap, volume });
    }

    await writeCSV(data, "data.csv");
    console.log("data generated!");
    await browser.close();
  })
  .catch(async (e) => {
    console.log(e);
    await browser.close();
  });
