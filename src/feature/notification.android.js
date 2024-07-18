import PushNotification from 'react-native-push-notification'
import { CHANNEL_ID } from '../data/Link';

const showNotifications = ( title, message ) => {
    PushNotification.localNotification({
        channelId: CHANNEL_ID,
        title: title,
        message: message,
    });
};

const handleScheduleNotification = ( title, message ) => {
    PushNotification.localNotificationSchedule({
        title: title,
        message: message,
        date: new Date(Date.now() + 5 * 1000)
    });
};

const handleCancel = () => {
    PushNotification.cancelAllLocalNotifications();
};

export { showNotifications, handleScheduleNotification, handleCancel}