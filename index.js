require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');
const winston = require('winston');

// Init error logger
const logger = winston.createLogger({
	level: 'error',
	format: winston.format.json(),
	transports: [
		// - Write all logs with level `error` and below to `error.log`
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
	],
});

const { PING_GROUP_ID, WEBHOOK_ID, WEBHOOK_TOKEN, WEBHOOK_FULL_URL } = process.env;
let hook;
// If the webhook url is goven, use that
// otherwise see if Token and Id are given
// if data is missing, exit()
if(WEBHOOK_FULL_URL !== "") {
	const splitUrl = WEBHOOK_FULL_URL.split("/");
	const hookId = splitUrl[splitUrl.length - 2];
	const hookToken = splitUrl[splitUrl.length - 1];
	//console.log(JSON.stringify(hookId) + JSON.stringify(hookToken))
	hook = new Discord.WebhookClient(hookId, hookToken)
} else if (WEBHOOK_ID !== "" && WEBHOOK_TOKEN !== ""){
	hook = new Discord.WebhookClient(WEBHOOK_ID,WEBHOOK_TOKEN);
} else {
	const currentErrorMessage = "You must provide either a full webhook URL, or the ID and TOKEN in the .env file to run this program";
	console.log(currentErrorMessage)
	logger.error(currentErrorMessage);
	process.exit(1);
}
if(PING_GROUP_ID === ""){
	const currentErrorMessage = "You must provide a role ID in the .env file to run this program";
	console.log(currentErrorMessage);
	logger.error(currentErrorMessage);
	process.exit(1)
}
const PING_TAG = `<@&${PING_GROUP_ID}>`;


logger.error("Script started, log initialized :) " + new Date().toDateString());

hook.send(`Beware ${PING_TAG}! I live`);
let iterator = 0;
const listenLoop = () => {
	if(iterator % 500 === 0 && iterator !== 0 || iterator === 5){
		let seconds = iterator * 5;
		let minutes = Math.floor(seconds/60);
		let hours = Math.floor(minutes/60);
		seconds = seconds - minutes * 60;
		minutes = minutes - hours * 60;
		hook.send(`Uptime: ${hours}:${minutes}:${seconds}. Currently no end in sight`);
	}
	axios.get('https://www.bestbuy.com/site/nvidia-geforce-rtx-3090-24gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429434.p?skuId=6429434')
		.then((response) => {
			//hook.send(typeof response.data);
			if(response.data.includes('<button class="btn btn-disabled btn-lg btn-block add-to-cart-button"')) {
				//hook.send(`RTX 3090 out of stock`);
				console.log(`Request #${iterator}. No end in sight`);
			} else {
				console.log(`Request #${iterator}. The end is nigh`);
				hook.send(`${PING_TAG} https://www.bestbuy.com/site/nvidia-geforce-rtx-3090-24gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429434.p?skuId=6429434 GO BUY NOW!!`);
			}
			

		})
		.catch((err) => {logger.error(err); console.error(err);});
		// This is the test case I used to make sure this method of detecting stock actually works
	/*axios.get('https://www.bestbuy.com/site/core-i9-10850k-desktop-processor-10-cores-up-to-5-2-ghz-unlocked-lga1200-intel-400-series-chipset-125w/6428160.p?skuId=6428160')
		.then((response) => {
			if(response.data.includes('<button class="btn btn-disabled btn-lg btn-block add-to-cart-button"')) {
				hook.send(`Product out of stock`);
			} else {
				hook.send('intel thing in stock');
			}
			

		});
*/	
	iterator++;
	setTimeout(listenLoop, 5000);
}
listenLoop();
