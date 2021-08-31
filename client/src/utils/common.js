import moment from 'moment';
import crypto from 'crypto';

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


export function encrypt(text,IV_LENGTH,ENCRYPTION_KEY){
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV_LENGTH);
    // let encrypted = cipher.update(text);
    return cipher.final()
    // console.log("encrypted",encrypted)
    // encrypted = Buffer.concat([encrypted, cipher.final()]);
   
    // return encrypted
}

export function decrypt(text,ENCRYPTION_KEY){
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
   
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return decrypted.toString();
}
