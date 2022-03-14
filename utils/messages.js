const moment = require('moment');
const { getuser } = require('./users');

function formatmsg(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
};

function location(username, lat, lng) {
    return {
        username,
        url: `https://www.google.com/maos?q=${lat}, ${lng}`,
        time: moment().format('h:mm a')
    }
}
module.exports = { formatmsg, location };