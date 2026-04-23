import db from './src/db/database.js';
const data = {
  buildings: db.prepare('SELECT * FROM Facilities').all(),
  assets: db.prepare('SELECT * FROM Assets').all(),
  vendors: db.prepare('SELECT * FROM Vendors').all()
};
console.log(JSON.stringify(data));
