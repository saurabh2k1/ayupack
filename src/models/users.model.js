/* eslint-disable no-console */

// users-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'users'
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.engine('InnoDB');
        table.increments('id');
      
        table.string('email').unique();
        table.string('password');
        table.string('first_name');
        table.string('last_name');
        table.string('googleId');
        
        table.string('facebookId');
        table.string('avatar');
        table.timestamps();
      
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};
