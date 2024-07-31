const admin = require('./firebaseAdmin');

const updateTodos = async (userId) => {
    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);
    const tomorrowRef = userRef.collection('lists').doc('Tomorrow');
    const todayRef = userRef.collection('lists').doc('Today');

    try {
        const tomorrowDoc = await tomorrowRef.get();
        const todayDoc = await todayRef.get();

        if (!tomorrowDoc.exists || !todayDoc.exists) {
            console.log('Document(s) not found.');
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const tomorrowData = tomorrowDoc.data();
        const todayData = todayDoc.data();

        if ((tomorrowData.lastDate === yesterdayStr) && (todayData.lastDate === yesterdayStr)) {
            if (tomorrowData.todos && tomorrowData.todos.length > 0) {
                await todayRef.update({ todos: tomorrowData.todos });
            } else {
                const updatedTodos = todayData.todos.map(todo => ({
                    ...todo,
                    completed: false
                }));
                await todayRef.update({ todos: updatedTodos });
            }
            console.log('Todos updated successfully.');
        } else {
            console.log('No updates needed as lastDate is not yesterday.');
        }
    } catch (error) {
        console.error('Error updating todos:', error);
    }
};

module.exports = {
    updateTodos
};
