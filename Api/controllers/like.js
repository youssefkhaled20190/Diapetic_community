import { Db } from "../connectDB.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
    const q = `SELECT userid FROM LIKES WHERE postid=?`;
  
    Db.query(q, [req.query.postid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(like=>like.userid));
    });
  };
  

  export const addLikes =(req ,res)=>{

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
    

      const q = "INSERT INTO likes (`userid`,`postid`) VALUES (?)" ;
      const Values = [
        userInfo.id,
        req.body.postid
      ];
      Db.query(q, [Values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("post have been liked");
      });
  });
}

export const deleteLikes = (req, res) => {
    

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM likes WHERE `userid` = ? AND `postid` = ?";
  
      Db.query(q, [userInfo.id, req.query.postid], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been disliked.");
      });
    });
  };