import Express from "express";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import relationshipRoutes from "./routes/relationships.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";


const app = Express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(Express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/youtube2022/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/users" , userRoutes)
app.use("/api/posts" , postRoutes)
app.use("/api/comments" , commentRoutes)
app.use("/api/likes" , likeRoutes)
app.use("/api/auth" , authRoutes)
app.use("/api/relationships", relationshipRoutes);


app.listen(8800 , ()=>{
    console.log("API WORKING....");
})