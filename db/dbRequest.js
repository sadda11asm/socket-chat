var db = require('./db.js');

module.exports = {

	login: (data, callback) => {
		db.query("SELECT iduser FROM user WHERE token=? AND name=?", [data.token, data.name], (err, res) => {
			if (err){
				callback(err.sqlMessage, null);
				return;
			}
			if (res.length>0){
				callback(null, res[0].iduser);
			} else {
				callback("error", null);
			}
			
		});
	},
	sendMsg: (data, callback) => {
		db.query("SELECT * FROM chat_members WHERE iduser=? AND idchat=?", [data.iduser, data.idchat], (err, res) => {
			if (err){
				console.log(err);
				callback("error", null);
				return;
			}
			if (res.length==0){
				callback("bad", null);
				return;
			}
			db.query("INSERT INTO message (iduser, idchat, content) VALUES (?, ?, ?)", [data.iduser, data.idchat, data.content], (err2, res2) => {
				if (err2){
					callback(err2, null);
					return;
				}
				db.query("SELECT iduser FROM chat_members WHERE idchat=?", [data.idchat], (err3, res3) => {
					if (err3){
						callback(err3, null);
					}
					callback(null, res3);
				});
				
			});
		});
	},
	joinChat: (data, callback) => {
		db.query("INSERT INTO chat_members (iduser, idchat) VALUES (?, ?)", [data.iduser, data.idchat], (err, res) => {
			if (err) {
				console.log(err);
				callback(err, null);
				return;
			}
			callback(null, 'ok')
		});
	},
	createChat: (data, callback) => {
		db.query("INSERT INTO chat (title, admin) SELECT ?, ? WHERE (SELECT type FROM user WHERE iduser=?)=0", [data.title, data.iduser, data.iduser], (err, res) => {
			if (err){
				console.log(err);
				callback("error", null);
				return;
			}
			if ( res.affectedRows == 0 ) {
				console.log("rrr");
				callback("error", null);
				return;
			}
			console.log(res);
			var idchat = res.insertId;
			var sqlReq = "INSERT INTO chat_members (iduser, idchat) VALUES ( "+data.iduser+" , "+idchat+" )";
			var i;
			for (i=0; i<data.members.length; i++){
				sqlReq = sqlReq + ", ( "+data.members[i]+", "+idchat+" )";
			}
			db.query(sqlReq, [], (err, res) => {
				if (err){
					console.log(err);
					callback("error", null);
					return;
				}
				callback(null, 'ok');
			});
			

		});
	},
	raadChat: (data, callback) => {
		db.query("")
	}

}