let TXCuoc    = require('../../Models/TaiXiu_cuoc');
let TXCuocOne = require('../../Models/TaiXiu_one');

/**
 * Hàm random số tiền cược
 * return {number}
 */
let random = function () {
	let a = (Math.random() * 85) >> 0;
	if (a == 85) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 1200000;
	} else if (a >= 77) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 900000;
	} else if (a >= 69) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 700000;
	} else if (a >= 60) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 500000;
	} else if (a >= 52) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 400000;
	} else if (a >= 45) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 150000;
	} else if (a >= 38) {
		return (Math.floor(Math.random() * (20 - 3 + 1)) + 3) * 100000;
	} else if (a >= 32) {
		return (Math.floor(Math.random() * (20 - 5 + 1)) + 5) * 10000;
	} else if (a >= 30) {
		return (Math.floor(Math.random() * (20 - 10 + 1)) + 10) * 10000;
	} else if (a >= 26) {
		return (Math.floor(Math.random() * 1) + 10) * 10000;
	} else if (a >= 21) {
		return (Math.floor(Math.random() * 1) + 10) * 10000;
	} else if (a >= 15) {
		return (Math.floor(Math.random() * (10 - 5 + 1)) + 5) * 100000;
	} else if (a >= 8) {
		return (Math.floor(Math.random() * (7 - 2 + 1)) + 2) * 100000;
	} else {
		return (Math.floor(Math.random() * (100 - 10 + 1)) + 10) * 10000;
	}
};

/**
 * Một bot cược
 */
let singleBotBet = function (bot, io) {
	let cuoc = (30 * random()) / 12;
	let select = !!((Math.random() * 2) >> 0);
	let fakeplayer = (Math.random() * 50) + 1;

	if (select) {
		io.taixiu.taixiu.red_tai += cuoc;
		io.taixiu.taixiu.red_player_tai += fakeplayer;
	} else {
		io.taixiu.taixiu.red_xiu += cuoc;
		io.taixiu.taixiu.red_player_xiu += fakeplayer;
	}

	TXCuocOne.create({ uid: bot.id, phien: io.TaiXiu_phien, select, bet: cuoc });
	TXCuoc.create({ uid: bot.id, bot: true, name: bot.name, phien: io.TaiXiu_phien, bet: cuoc, select, time: new Date() });

	console.log(`[BOT] ${bot.name} cược ${cuoc.toLocaleString()} vào ${select ? 'Tài' : 'Xỉu'}`);
};

/**
 * Gọi nhiều bot cược rải đều trong thời gian duration (ms)
 */
let tx = function (botList, io, duration = 60000) {
	if (!Array.isArray(botList) || botList.length === 0) return;

	let botCount = botList.length;
	let interval = duration / botCount;

	botList.forEach((bot, index) => {
		let delay = Math.floor(index * interval + Math.random() * 1000);

		setTimeout(() => {
			singleBotBet(bot, io);
		}, delay);
	});
};

module.exports = {
	tx
};
