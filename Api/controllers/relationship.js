import { Db } from "../connectDB.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req,res)=>{
    const q = "SELECT followerUserid FROM relationships WHERE followedUserid = ?";

    Db.query(q, [req.query.followedUserid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(relationship=>relationship.followerUserid));
    });
}

export const addRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserid`,`followedUserid`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    Db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationships = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE `followerUserid` = ? AND `followedUserid` = ?";

    Db.query(q, [userInfo.id, req.query.userid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};