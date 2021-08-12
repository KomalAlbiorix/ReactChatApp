import moment from 'moment';

export function dateConvert(chatTime) {
    let date = moment(chatTime);
    if (moment().diff(date, 'days') > 1) {
        return date.fromNow(); // '2 days ago' etc.
    }
    return date.calendar().split(' ')[0];
}


export function timeConvert(chatTime) {
    let date = moment(chatTime);
    if (moment().diff(date, 'days') > 1) {
        return date.fromNow(); // '2 days ago' etc.
    }
    return date.calendar().split('at')[1];
}
