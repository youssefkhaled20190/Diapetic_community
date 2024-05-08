import mysql from "mysql"

export const Db = mysql.createConnection({
    "host":"localhost",
    "user":"root",
    "password":"",
    "database":"diabetescommunity"

});