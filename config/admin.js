const Admin        = require('../app/Models/Admin');
const generateHash = require('../app/Helpers/Helpers').generateHash;
const HU           = require('../app/Models/HU');
const ZeusPercent  = require('../app/Models/Zeus/Zeus_percent');
const BauCua       = require('../app/Models/BauCua/BauCua_temp');

(async () => {
  try {
    const totalAdmins = await Admin.estimatedDocumentCount();
    if (totalAdmins === 0) {
      await Admin.create({ username: 'admin', password: generateHash('123456'), rights: 9, regDate: new Date() });
    }
    if (totalAdmins === 1) {
      await Admin.create({ username: 'kvcpro', password: generateHash('123456'), rights: 9, regDate: new Date() });
    }

    const initHU = async (game, type, bet) => {
      const exists = await HU.findOne({ game, type, red: true });
      if (!exists) {
        await HU.create({ game, type, red: true, bet, min: bet });
      }
    };

    const initMultipleHUs = async (game, values) => {
      for (const val of values) {
        await initHU(game, val.type, val.bet);
      }
    };

    if (!await BauCua.findOne()) {
      await BauCua.create({});
    }

    await initMultipleHUs('minipoker', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('bigbabol', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('vuongquocred', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('mini3cay', [
      { type: 100, bet: 250000 },
      { type: 1000, bet: 2500000 },
      { type: 10000, bet: 25000000 },
    ]);

    await initMultipleHUs('caothap', [
      { type: 1000, bet: 7000 },
      { type: 10000, bet: 70000 },
      { type: 50000, bet: 350000 },
      { type: 100000, bet: 700000 },
      { type: 500000, bet: 3500000 },
    ]);

    await initMultipleHUs('arb', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('candy', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('long', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('Zeus', [
      { type: 100, bet: 500000 },
      { type: 1000, bet: 5000000 },
      { type: 10000, bet: 50000000 },
    ]);

    await initMultipleHUs('megaj', [
      { type: 100, bet: 5000000 },
      { type: 1000, bet: 50000000 },
      { type: 10000, bet: 200000000 },
    ]);

    console.log('✅ Khởi tạo dữ liệu hoàn tất.');
  } catch (err) {
    console.error('❌ Lỗi khởi tạo dữ liệu:', err);
  }
})();
