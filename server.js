const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "MaggieMoo.22$",
    database: "election",
  },
  console.log("Connected to the election database.")
);

app.get("/api/candidates", (req, res) => {
  const sql = `
    SELECT candidates.*, parties.name AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({
      message: 'Success!',
      data: rows
    });
  });
});

app.get("/api/candidate/:id", (req, res) => {
  const sql = `
    SELECT candidates.*, parties.name AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ${req.params.id}
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({
      message: 'Success!',
      data: rows
    });
  });
});

app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
