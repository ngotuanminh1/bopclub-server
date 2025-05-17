const TaiXiu_bot_chat = require('../Models/TaiXiu_bot_chat');

module.exports = function (redT) {
    setInterval(async function () {
        try {
            const count = await TaiXiu_bot_chat.countDocuments({});
            if (!count) return;

            const skip = Math.floor(Math.random() * count);
            const chat = await TaiXiu_bot_chat.findOne().skip(skip).lean();

            if (!chat) return;

            const userNames = [
                "minhng5616", "hoanganh98", "trungkts", "bichhanh99", "vietanhx1",
                "dongduong56", "duyvip79", "khachmoi01", "son12345", "thaobx08",
                "laicamxe123", "toananh6", "ngonnguyenanh9x", "maianhtrieu", "qrepewa2x12",
                "ykiung6868", "dungraxiu12", "631anhtuan", "qweer23", "giungki001"
            ];

            const user = userNames[Math.floor(Math.random() * userNames.length)];
            const value = chat.Content || "Chơi tiếp đi anh em!";

            const message = {
                taixiu: {
                    message: {
                        user: user,
                        value: value
                    }
                }
            };

            redT.clients.forEach(function (ws) {
                if (ws.readyState === 1 && ws.auth === true) {
                    ws.send(JSON.stringify(message));
                }
            });

        } catch (err) {
            console.error('Bot chat error:', err);
        }
    }, 5000); // Gửi mỗi 5 giây
};
