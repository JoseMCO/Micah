const _ = require('lodash');
const jsonfile = require('jsonfile');

var file_path = null;
var db = null;

function write_db() {
  jsonfile.writeFile(file_path, db, {spaces: 2}, function(err) {
    console.error(err);
  });
};

exports.read_db = (file, config) => {
  file_path = file;
  jsonfile.readFile(file_path, function(err, data) {
    if (!data || data === undefined) {
      data = {
        users: _.map(config.telegram.admin_ids, (u)=>{ return {id: u, admin: true}})
      }
      jsonfile.writeFile(file_path, data, {spaces: 2}, function(err) {
        console.error(err);
      });
    }
    db = data;
  });
};

exports.get_db = () => {
  return db.users;
};

exports.get_users = () => {
  return db.users;
};

exports.is_admin = (user_id) => {
  const user = _.find(db.users, (u)=>{return u.id == user_id});
  if (!user) {
    return false;
  }
  return user.admin;
};

exports.set_admin = (user_id, admin) => {
  var user = _.find(db.users, (u)=>{return u.id == user_id});
  if (!user) {
    return false;
  }
  _.remove(db.users, (u)=>{ return u.id == user_id });
  db.users.push({...user, admin: admin}) 
  
  write_db();

  return true;
};