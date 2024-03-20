const express = require("express");
const ExpressError = require("./expressError");
const userRoutes = require("./userRoutes")

const app = express();


app.use(express.json());

//app.use('/users', userRoutes)

let axios = require('axios');


app.post('/', async function(req, res, next) {
  try {
      const developers = req.body.developers;
      if (!developers || !Array.isArray(developers)) {
          throw new ExpressError("Invalid input. 'developers' field must be an array.", 400);
      }

      // Declare the callback function as async
      const results = await Promise.all(developers.map(async username => {
          const response = await axios.get(`https://api.github.com/users/${username}`);
          return response.data;
      }));

      const usersInfo = results.map(user => ({
          name: user.name,
          bio: user.bio
      }));

      return res.json(usersInfo);
  } catch (err) {
      next(err);
  }
});


     

// 404 handler
app.use((req, res, next) => {
  // 404 handler
  res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
  // Error handler
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});
  

app.listen(3001, function () {
    console.log("Server is listening on port 3001");
});
  