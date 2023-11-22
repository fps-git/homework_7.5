const { clickElement, checkElement, getText } = require("./lib/commands.js");

let page;
let standardTicketPrice = "1000";
let vipTicketPrice = "3500";

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("http://qamid.tmweb.ru/client/index.php");
  await page.waitForSelector(".movie")
  if (await checkElement(page, "a.movie-seances__time:not(.acceptin-button-disabled)")) {
    await clickElement(page, "a.movie-seances__time:not(.acceptin-button-disabled)");
  } else {
    await clickElement(page, "a.page-nav__day:not(.page-nav__day_today)");
    await clickElement(page, "a.movie-seances__time");
  }
});

afterEach(() => {
  page.close();
});

describe("Happy path ticket buying tests", () => {
  
  test("Successful buying of standard ticket", async () => {
    await clickElement(page, ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)");
    await clickElement(page, ".acceptin-button");

    const actual1 = await getText(page, ".ticket__cost");
    await expect(actual1).toEqual(standardTicketPrice);
    await clickElement(page, ".acceptin-button");

    const actual2 = await checkElement(page, "img.ticket__info-qr");
    await expect(actual2).toEqual(true);
  });

  test("Successful buying of VIP ticket", async () => {
    await clickElement(page, ".buying-scheme__chair_vip:not(.buying-scheme__chair_taken)");
    await clickElement(page, ".acceptin-button");

    const actual1 = await getText(page, ".ticket__cost");
    await expect(actual1).toEqual(vipTicketPrice);
    await clickElement(page, ".acceptin-button");

    const actual2 = await checkElement(page, "img.ticket__info-qr");
    await expect(actual2).toEqual(true);
  });
});

describe("Sad path ticket buying tests", () => {
  
  test("Unsuccessful buying of ticket because of taken chair", async () => {
    await clickElement(page, ".buying-scheme__chair_taken)");

    const actual = await checkElement(page, "button[disabled=true]");
    await expect(actual).toEqual(true);
  });
});