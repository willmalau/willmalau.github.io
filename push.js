var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BKGZq6EhEEjuWt6UvLnirlvR94PN8u6bHjCisKrd48Dd9BZSTPRuWsLishmecwqbXnode2zNYR5uB8ejTLmHKhA",
    "privateKey": "qC-V4FkPek02g2bO-yJUr_9r_VpVKpCD9fNaoEkLuYo"
};


webPush.setVapidDetails(
    'mailto:will.andri.malau@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dW5YX_CAZrs:APA91bEGKOgpRh4PYuRtNT5MOyFT4ne1atdobG3QLesS-XOKgTok2UFkuOimhW2u7PhFYqhraeeKcWwK4ongTdfqHy3Dv-Hudy3aUSsaax3tVyfdOo9ILeBVNF7HhaRodIpUvXAlP4EJ",
    "keys": {
        "p256dh": "BM5tHEaYiLVOdl3b0uhbfyOn9ZrTAZoklDo88n9Nq5819WR/4FKCjFn3FTTAdXU2TZgPOFvZesUewPllVL1pUVM=",
        "auth": "jqDyAYkC/J+S/47Fcpt6cw=="
    }
};
var payload = 'Selalu update tentang sepak bola bersama gila bola';

var options = {
    gcmAPIKey: '29971041999',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);