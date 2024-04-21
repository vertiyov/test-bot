const TelegramBot  = require('node-telegram-bot-api')

const token = '6553288158:AAEh4hz-LyOyi1-HI3xz1rwZ4WZvZTKV_kA'

const bot  = new TelegramBot(token, {polling:true})

const chats = {
}

const UserModel = require('./models')
const sequelize =  require('./db')

const {gameOptions, againOptions} = require('./options.js')

const startgame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал число от 0 до 9, твоя задача его угадать');
    const randomNumber  =Math.floor(Math.random()*10);
    chats[chatId]  = randomNumber;
    console.log(chats)
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}



const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log(`Подключение к БД произошло с ошибкой ${e}`)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/game', description: 'Узнай свою везучесть'},
        {command: '/info', description: 'Информация обо мне'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                return bot.sendMessage(chatId, 'Добрый день')
            }
            if (text === '/game') {
                return startgame(chatId)
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                console.log(user)
                return bot.sendMessage(chatId, `Всего правильных ответов ${user.right}, неправильных ${user.wrong}`)
            }
            return bot.sendMessage(chatId, 'Моя твоя не понимать такой команды не знат')
        } catch (e) {
            return bot.sendMessage(`Произошла ошибка ${e}`)
        }

    })

    bot.on('callback_query', async msg => {
        const data= msg.data;
        const chatId = msg.message.chat.id;
        const user = await UserModel.findOne({chatId})
        if (data === '/again') {
            return startgame(chatId)
        }

        if (parseInt(data)===chats[chatId]) {
            user.right +=1
            await bot.sendMessage(chatId,`Ты выбрал цифру ${data} и угадал`, againOptions)
            await bot.sendAnimation(chatId, 'CAACAgIAAxkBAAEE39xmJMCR8byQkA_pIL7ibcFa_V6GlAAC2EMAAkgxeEj33E65Z4bVrTQE')
        } else {
            user.wrong +=1
            await bot.sendMessage(chatId,`Не в этот раз`, againOptions)
            await bot.sendAnimation(chatId, 'CAACAgIAAxkBAAEE395mJMC_kqGEWJ1FOljpkpHeCSBd9gACn0sAArGDeUi3nbaAtWPbNTQE')
        }
        await user.save();
    })
}

start()


