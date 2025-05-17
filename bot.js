// Setting & Connect to the Database
let configDB = require('./config/database');
let mongoose = require('mongoose');
let User = require('./app/Models/Users');

let helpers = require('./app/Helpers/Helpers');
// mongoose.set('debug', true);
require('mongoose-long')(mongoose); // INT 64bit

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

console.log(configDB);

async function connectDatabase() {
    try {
        await mongoose.connect(configDB.url, configDB.options);
        console.log('Connect to MongoDB success');

        // Load models
        let TaiXiu_User = require('./app/Models/TaiXiu_user');
        let MiniPoker_User = require('./app/Models/miniPoker/miniPoker_users');
        let Bigbabol_User = require('./app/Models/BigBabol/BigBabol_users');
        let VQRed_User = require('./app/Models/VuongQuocRed/VuongQuocRed_users');
        let BauCua_User = require('./app/Models/BauCua/BauCua_user');
        let Mini3Cay_User = require('./app/Models/Mini3Cay/Mini3Cay_user');
        let CaoThap_User = require('./app/Models/CaoThap/CaoThap_user');
        let AngryBirds_user = require('./app/Models/AngryBirds/AngryBirds_user');
        let Candy_user = require('./app/Models/Candy/Candy_user');
        let LongLan_user = require('./app/Models/LongLan/LongLan_user');

        let XocXoc_user = require('./app/Models/XocXoc/XocXoc_user');
        let MegaJP_user = require('./app/Models/MegaJP/MegaJP_user');

        let UserInfo = require('./app/Models/UserInfo');

        let password = "@demo54321";
        var fs = require('fs');
        var obj = JSON.parse(fs.readFileSync('config/bot-username.json', 'utf8'));

        var crypto = require('crypto');

        let az09 = new RegExp('^[a-zA-Z0-9]+$');
        let users = [];

        for (let i in obj) {
            let testName = az09.test(obj[i]);
            if (testName && obj[i].length <= 14) {
                users.push(obj[i]);
            }
        }

        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        async function insertUserInfo(Uid, name, date_create) {
            try {
                const check = await UserInfo.findOne({ 'name': name }).lean();
                if (!check) {
                    const user = await UserInfo.create({
                        'id': Uid,
                        'name': name,
                        'joinedOn': date_create,
                        'type': true
                    });

                    // Default properties for new user
                    user.level = 1;
                    user.vipNext = 100;
                    user.vipHT = 0;
                    user.phone = '';

                    await user.save();

                    // Create entries for each game user model
                    await Promise.all([
                        TaiXiu_User.create({ 'uid': Uid }),
                        MiniPoker_User.create({ 'uid': Uid }),
                        Bigbabol_User.create({ 'uid': Uid }),
                        VQRed_User.create({ 'uid': Uid }),
                        BauCua_User.create({ 'uid': Uid }),
                        Mini3Cay_User.create({ 'uid': Uid }),
                        CaoThap_User.create({ 'uid': Uid }),
                        AngryBirds_user.create({ 'uid': Uid }),
                        Candy_user.create({ 'uid': Uid }),
                        LongLan_user.create({ 'uid': Uid }),
                        XocXoc_user.create({ 'uid': Uid }),
                        MegaJP_user.create({ 'uid': Uid })
                    ]);

                }
            } catch (err) {
                console.error('Error inserting user info:', err);
            }
        }

        async function createBotUsers() {
            try {
                for (const name of users) {
                    const username = `${name}_bot`;
                    const date_create = randomDate(new Date(2021, 0, 1), new Date());

                    const existingUser = await User.findOne({ 'local.username': username }).exec();

                    if (existingUser) {
                        console.log(`${name} already exists. User ID: ${existingUser._id}`);
                        await insertUserInfo(existingUser._id, name, existingUser.local.regDate);
                    } else {
                        const newUser = await User.create({
                            'local.username': username,
                            'local.password': helpers.generateHash(password),
                            'local.regDate': date_create
                        });

                        console.log(`Created new user: ${name} with ID: ${newUser._id}`);
                        await insertUserInfo(newUser._id, name, newUser.local.regDate);
                    }
                }

            } catch (err) {
                console.error('Error creating bot users:', err);
            }
        }

        // Start bot user creation process
        await createBotUsers();
    } catch (error) {
        console.log(error);
        console.log('Connect to MongoDB failed', error);
    }
}

// Start database connection and user creation
connectDatabase();
