import { query } from "express";
import { Db } from "../connectDB.js";
import jwt from "jsonwebtoken";


export const GetUsers = (req, res) => {
  const UserId = req.params.userid;
  const q = "SELECT * FROM users WHERE id = ?";
  Db.query(q, [UserId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const GetAllUsers = (req, res) => {
  const UserId = req.params.userid;
  const q = "SELECT * FROM users WHERE id != ?";
  Db.query(q, [UserId], (err, data) => {
    if (err) return res.status(500).json(err);
    const info = data.map((user)=>{
      const { password, ...userInfo } = user;
      return userInfo;
    });
    return res.json(info);
  });
};

export const GetAllUsersByname = (req, res) => {
  const { userName } = req.params;
  const q = "SELECT * FROM users WHERE name LIKE  ?";
  Db.query(q, [userName], (err, data) => {
    if (err) return res.status(500).json(err);
    const info = data.map((user)=>{
      const { password, ...userInfo } = user;
      return userInfo;
    });
    return res.json(info);
  });
};



export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    Db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};