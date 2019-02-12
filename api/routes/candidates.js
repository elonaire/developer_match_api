const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1");
const path = require("path");
const fs = require("fs");

router.post("/", (req, res, next) => {
  let name = req.body.name;
  let skills = req.body.skills;
  let id = uuidv1();

  if (!name || !skills) {
    res.status(400).json({
      message: "Bad Request"
    });
  }

  let candidateData = {
    id: id,
    name: name,
    skills: skills
  };

  //let candidate = JSON.stringify(candidateData);

  fs.readFile(path.join("./database/candidates.json"), (err, data) => {
    if (err) {
      let candidates = [];
      candidates.push(candidateData);
      let jsonCandidates = JSON.stringify(candidates);
      fs.writeFile(
        path.join("./database/candidates.json"),
        jsonCandidates,
        err => {
          if (err) throw err;
          res.status(201).json({
            message: "Successfully created",
            user: {
              id: id,
              name: name,
              skills: skills
            }
          });
        }
      );
    }

    if (data) {
      let candidates = JSON.parse(data);
      candidates.push(candidateData);
      let jsonCandidates = JSON.stringify(candidates);
      fs.writeFile(
        path.join("./database/candidates.json"),
        jsonCandidates,
        err => {
          if (err) throw err;
          res.status(201).json({
            message: "Successfully created",
            user: {
              id: id,
              name: name,
              skills: skills
            }
          });
        }
      );
    }
  });
});

router.get("/search", (req, res, next) => {
  let searchedSkills = req.query.skills;
  if (!searchedSkills) {
    res.status(400).json({
      message: "Bad Request"
    });
  }
  searchedSkills.split(",");

  fs.readFile(path.join("./database/candidates.json"), (err, data) => {
    if (err) {
      res.status(404).json({
        message: "No student records in the database"
      });
    }

    let candidates = JSON.parse(data);
    let results = [];

    candidates.forEach(candidate => {
      let skills = candidate.skills;
      skills.trim();
      skills.split(",");
      let match = 0;
      for (let i = 0; i < searchedSkills.length; i++) {
        for (let j = 0; j < skills.length; j++) {
          if (searchedSkills[i] === skills[j]) {
            match++;
          }
        }
      }

      results.push({
        name: candidate.name,
        id: candidate.id,
        skills: candidate.skills,
        match: match
      });
    });

    results.sort((a, b) => (a.match > b.match ? -1 : 1));
    let bestMatch = results[0];
    res.status(200).json({
      bestMatch: {
        name: bestMatch.name,
        skills: bestMatch.skills
      }
    });
  });
});

module.exports = router;
