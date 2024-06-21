const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());

const token = '7028137882:AAFfpa6V2d9JpGkRJJaTG4uLhp5PNMkCTTY';
const bot = new TelegramBot(token);

bot.setWebHook(`https://9623-2401-4900-1ca9-319b-9c17-1290-1482-f3ea.ngrok-free.app/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let gameState = {};

function startGame(chatId) {
    gameState[chatId] = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    bot.sendMessage(chatId, renderGame(gameState[chatId]));
}

function makeMove(chatId, move) {
    const [x, y] = move.split(',').map(Number);
    if (gameState[chatId][x][y] === ' ') {
        gameState[chatId][x][y] = 'X';
        // Add AI or second player move here
    }
    bot.sendMessage(chatId, renderGame(gameState[chatId]));
}

function renderGame(board) {
    return board.map(row => row.join(' | ')).join('\n');
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        bot.sendMessage(chatId, "Welcome to the game! Type 'play' to start.");
    } else if (text === 'play') {
        startGame(chatId);
    } else if (text.startsWith('move')) {
        const move = text.split(' ')[1];
        makeMove(chatId, move);
    }
});
