import express, { Request, Response } from 'express';
import pool from './db';
import redis from './redis';
import os from 'os'

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await redis.ping();
    console.log('Reddis connected!');
    next();
  } catch (err) {
    console.error('Redis connection failed:', err);
    res.status(500).send('Redis is not available');
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/info", (req: Request, res: Response) => {
  res.send(`current host is ${os.hostname}`);
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", err: {err} });
  }
});

app.get("/setRedis/:key/:value", async (req: express.Request<{ key: string; value: string }>, res) => {
  try {
    const {key, value} = req.params;

    if (!key || !value) {
      return res.status(400).send('Please provide both "key" and "value" as query parameters.');
    }

    await redis.set(key, value);
    res.status(200).send(`Key "${key}" set to value "${value}" in Redis.`);


  } catch (err) {
    res.status(500).json({ error: "Database query failed", err: {err} });
  }
});

app.get("/getRedis/:key/", async (req: express.Request<{ key: string; value: string }>, res) => {
  try {
    const {key} = req.params;

    if (!key) {
      return res.status(400).send('Please provide "key" parameter');
    }

    var value = await redis.get(key);
    res.status(200).send(`Value for the Key "${key}" is "${value}".`);


  } catch (err) {
    res.status(500).json({ error: "Database query failed", err: {err} });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
