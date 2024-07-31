const admin = require('./firebaseAdmin');
const resetStreak = async () => {
    const db = admin.firestore();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const promises = [];
    snapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.lastDateFocus && userData.lastDateFocus !== yesterdayStr) {
            promises.push(doc.ref.update({ streak: 0 }));
        }
    });

    await Promise.all(promises);
    console.log('Streaks reset completed.');
    return null;
};

module.exports = {
    resetStreak
};
