const functions = require('firebase-functions');
const { resetStreak } = require('./Focus');
const { updateTodos } = require('./Todo');

exports.resetStreak = functions.pubsub.schedule('every day 00:00').onRun((context) => {
    resetStreak();
    return null;
});

exports.updateTodos = functions.https.onRequest(async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        res.status(400).send('Missing userId parameter.');
        return;
    }

    try {
        await updateTodos(userId);
        res.status(200).send('Todos updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating todos: ' + error.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
    }
});
