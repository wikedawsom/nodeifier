require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');

const { PING_USER_ID, WEBHOOK_ID, WEBHOOK_TOKEN } = process.env;
const hook = new Discord.WebhookClient(WEBHOOK_ID,WEBHOOK_TOKEN);

hook.send(`Beware ${PING_USER_ID}! I live`);
let iterator = 0;
const listenLoop = () => {
	if(iterator % 500 === 0 && iterator !== 0 || iterator === 5){
		let seconds = iterator * 10;
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
				console.log(`Request #${iterator}. No end in sight`)
			} else {
				hook.send(`${WIKE_TAG} https://www.bestbuy.com/site/nvidia-geforce-rtx-3090-24gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429434.p?skuId=6429434 GO BUY NOW!!`);
			}
			

		})
		.catch((err) => {console.log(err)});
	/*axios.get('https://www.bestbuy.com/site/core-i9-10850k-desktop-processor-10-cores-up-to-5-2-ghz-unlocked-lga1200-intel-400-series-chipset-125w/6428160.p?skuId=6428160')
		.then((response) => {
			if(response.data.includes('<button class="btn btn-disabled btn-lg btn-block add-to-cart-button"')) {
				hook.send(`Product out of stock`);
			} else {
				hook.send('intel thing in stock');
			}
			

		});
*/	iterator++;
	setTimeout(listenLoop, 10000);
}
listenLoop();
