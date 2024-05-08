import { Db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userid, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userid)
    WHERE c.postid = ? ORDER BY c.createdAt DESC
    `;

  Db.query(q, [req.query.postid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComments = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("token is not valid!");
  
      const q =
        "INSERT INTO comments (`desc`,`createdAt`,`userid` ,`postid`) VALUES (?)";
  
      const Values = [
        req.body.desc,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
        req.body.postid
      ];
  
      Db.query(q, [Values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("comment has been created.");
      });
    });
  };