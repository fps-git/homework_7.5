const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { clickElement, checkElement, getText } = require("../../lib/commands.js");
let totalprice;

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru${string}`, {
    setTimeout: 2000,
  });
});

When("user buys a {string} ticket to the nearest movie", async function (string) {
  if (await checkElement(this.page, "a.movie-seances__time:not(.acceptin-button-disabled)")) {
    await clickElement(this.page, "a.movie-seances__time:not(.acceptin-button-disabled)");
  } else {
    await clickElement(this.page, "a.page-nav__day:not(.page-nav__day_today)");
    await clickElement(this.page, "a.movie-seances__time");
  }
  await clickElement(this.page, `.buying-scheme__chair_${string}:not(.buying-scheme__chair_taken)`);
  await clickElement(this.page, ".acceptin-button");

  totalprice = await getText(this.page, ".ticket__cost");
  return await clickElement(this.page, ".acceptin-button");
});

Then("user gets a QR code for his reservation with {string} rubles price", async function (string) {
  const actual = await checkElement(this.page, "img.ticket__info-qr");
  expect(actual).equals(true);
  expect(totalprice).equals(string);
});

When("user buys a nearest movie ticket and try to chose taken chair", async function () {
  if (await checkElement(this.page, "a.movie-seances__time:not(.acceptin-button-disabled)")) {
    await clickElement(this.page, "a.movie-seances__time:not(.acceptin-button-disabled)");
  } else {
    await clickElement(this.page, "a.page-nav__day:not(.page-nav__day_today)");
    await clickElement(this.page, "a.movie-seances__time");
  }
  return await clickElement(this.page, ".buying-scheme__chair_taken)");
});

Then("user can't click on the confirmation button", async function () {
  const actual = await checkElement(this.page, "button[disabled=true]");
  expect(actual).equals(true);
});