// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require('moment');

const crypto = require('crypto');

//The Gravatar image service

const gravatarUrl = 'https://s.gravatar.com/avatar';
const query = 's=60&d=identicon';

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    const { email } = context.data;
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    context.data.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    context.data.avatar = `${gravatarUrl}/${hash}?${query}`;

    return context;
  };
};
