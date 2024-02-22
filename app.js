const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const scrapeUrls = async () => {

    // let driver = await new Builder().forBrowser(Browser.CHROME).build();
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless');

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build();
    const url = `https://www.geeksforgeeks.org/`;
    let all_urls = [];

    try {

        driver.get(url)       
        await driver.wait(until.elementLocated(By.className('ant-card-body')), 15000)
      
        const elements = await driver.findElements(By.css('div.ant-card-body > a'))

        const urls = await Promise.all(elements.map(async element => {
            const url = await element.getAttribute('href');
            return url;
        }));

        all_urls = urls

    } catch (error) {
        console.error('Error:', error);
    } 
    finally {
        await driver.quit();
    }

    return all_urls;
}


const main = async() => {
    const bot = new TelegramBot(BOT_TOKEN, { polling: false });

    const urls = await scrapeUrls();
    urls_str = urls.join('\n')
    console.log(urls);


    bot.sendMessage(CHAT_ID, urls_str).then(() => {
        console.log("Message sent successfully")
    }).catch(error => console.error('Error: ', error))

}

main()

// setInterval(main, 5 * 60 * 1000)
setInterval(main, 60 * 1000)
