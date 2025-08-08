// import { authorizationToken } from './middleware/auth';
const { authorizationToken } = require('./middleware/auth');
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const port = 4000;

app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
    try {
        const query = "SELECT * from USERS";
        const users = await pool.query(query);
        // console.log(users);

        res.json(users.rows);
    } catch(err) {
        console.log(err);
    }
});

app.get("/posts", async(req, res) => {
    try {
        const query = "SELECT * from posts";
        const result = await pool.query(query);
        // console.log(result.rows);
        res.json(result.rows);
    } catch(err) {
        console.log(err);
    } 
});

app.get("/userposts", async (req, res) => {
  // console.log(req.params);
  
  
  const client = await pool.connect();
  try {
    const userid = req.query.userid;

    const query = `SELECT * from posts where userid = ($1)`;
    const result = await client.query(query, [userid]);
    // console.log(result.rows);
    return res.status(201).json({message: "Successfully got the user posts", 
      userposts: result.rows
    })

  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  } finally {
    client.release();
  }
});

app.post("/signup", async (req, res) => {
  const client = await pool.connect();

  try {
    const { username, email, password } = req.body;

    const checkQuery = `SELECT * FROM users WHERE useremail = $1`;
    const result = await client.query(checkQuery, [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Account already exists. Please login." });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `INSERT INTO users (username, useremail, password) VALUES ($1, $2, $3)`;
      await client.query(insertQuery, [username, email, hashedPassword]);
      return res.status(201).json({ message: "Successfully signed up!" });
    }

  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Something went wrong on the server." });
  } finally {
    client.release();
  }
});


app.post("/login", async (req, res) => {
  const client = await pool.connect();
    // console.log(req.body);
  try {
    const { email, password } = req.body;

    const checkQuery = "SELECT * FROM users WHERE useremail = $1";
    const result = await client.query(checkQuery, [email]);

    if (result.rows.length === 0) {
    //   console.log("Invalid credentials!");
      return res.status(400).json({ message: "Invalid credentials!" });
    } else {
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // console.log("Invalid password!");
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
          {id: user.userid, email: user.useremail},
          SECRET_KEY,
          {expiresIn: "1h"}
        );

        return res.status(200).json({ 
          message: "Successfully logged in!" ,
          token,
          user: {
            id: user.id,
            name: user.username,
            email: user.useremail
          }
        });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
});


app.delete("/deletePost", async (req, res) => {
    const client = await pool.connect();
    try {
        const id = req.body.id;
        const userId = req.headers.userid;

        const query = `DELETE FROM posts WHERE id = $1 AND userid = $2`;
        const result = await client.query(query, [id, userId]);

        if (result.rowCount === 0) {
            // No rows deleted — either post doesn't exist or user isn't owner
            return res.status(403).json({ message: "Not authorized or post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Can't delete the post" });
    } finally {
        client.release();
    }
});



app.post("/addPost", async (req, res) => {
  const client = await pool.connect();

  try {
    const userName = req.body.username || "Default";
    // console.log(req.body);
    const title = req.body.title;
    const description = req.body.description;
    const tags = req.body.tags;

    const userId = req.headers.userid;
    
    // console.log(req.headers);

    const query = `INSERT INTO posts (username, title, description, tags, userid) VALUES ($1, $2, $3, $4, $5)`;
    await client.query(query, [userName, title, description, tags, userId]);

    res.status(201).json({ message: "Post added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong while adding the post" });
  } finally {
    client.release();
  }
});


app.post("/editPost", async (req, res) => {
  const client = await pool.connect();
//   console.log(req.body);
  try {
    const { id, title, description, tags } = req.body;
    const userid = req.headers.userid;

    const checkQuery = `SELECT * FROM posts WHERE id = $1 AND userid = $2`;
    const result = await client.query(checkQuery, [id, userid]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }


    const editQuery = `
      UPDATE posts
      SET title = $2, description = $3, tags = $4
      WHERE id = $1 AND userid = $5
    `;
    await client.query(editQuery, [id, title, description, tags, userid]);

    res.status(200).json({ message: "Post edited successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error editing post" });
  } finally {
    client.release();
  }
});

app.put("/like/:postId", async (req, res) => {
  const client = await pool.connect();
  const { postId } = req.params;
  const userId = req.body.userid;

  console.log(postId, userId);

  try {
    const checkQuery = "SELECT * FROM post_likes WHERE userid = $1 AND postid = $2";
    const checkResult = await client.query(checkQuery, [userId, postId]);

    if (checkResult.rows.length > 0) {
      return res.status(200).json({ message: "You've already liked it!!" });
    }

    const insertQuery = "INSERT INTO post_likes(userid, postid) VALUES ($1, $2)";
    await client.query(insertQuery, [userId, postId]);

    const updateQuery = "UPDATE posts SET reactions = reactions + 1 WHERE id = $1 RETURNING reactions";
    const result = await client.query(updateQuery, [postId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedReactions = result.rows[0].reactions;

    return res.status(200).json({
      message: "You've liked the post!!",
      likes: updatedReactions
    });
    
  } catch (err) {
    console.error("Error updating likes:", err);
    return res.status(503).json({ message: "Error updating likes" });
  } finally {
    client.release();
  }
});




app.listen(port, () => {
    console.log(`Server running in http://localhost:${port}`);
});