// Load dependencies
const express = require("express");
const db = require("./database.js");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

// Set server port
const PORT = process.env.PORT || 80;

// Start server
app.listen(PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API endpoints

// Get all users
app.get("/api/players", (req, res, next) => {
    const sql = "select * from players"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Get user by ID
app.get("/api/player/id/:id", (req, res, next) => {
    const sql = "select * from players where player_id = ?"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Get user by name
app.get("/api/player/name/:name", (req, res, next) => {
    const sql = 'select * from players where player_name like ?';
    const params = [req.params.name];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Get leaderboard for a stat
app.get("/api/leaderboard/:stat/:limit", (req, res, next) => {
    const params = [req.params.stat, req.params.limit];
    const sql = `SELECT player_name, ${params[0]} FROM players ORDER BY ${params[0]} DESC LIMIT ?`;
    params.shift();
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Get percentage for stat x / stat y (ie: hits/shot)
app.get("/api/xpery/:x/:y/:limit", (req, res, next) => {
    const params = [req.params.x, req.params.y, req.params.limit];
    const sql = `SELECT player_name, ${params[0]}, ${params[1]}, printf("%.2f", ((${params[0]} * 1.0) / ${params[1]})) AS return_value FROM players ORDER BY (${params[0]} / ${params[1]}) DESC LIMIT ?`;
    params.shift();
    params.shift();
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Create user - this is accomplished in-game, not via web
// Update user - this is accomplished in-game, not via web

// Delete user - disabled by default
// Recommended usage: enable, restart server, delete user, disable, restart server
/*
app.delete("/api/player/id/:id", (req, res, next) => {
    db.run(
        'DELETE FROM players WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});
*/

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});