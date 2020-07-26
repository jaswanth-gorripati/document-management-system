const app = (module.exports = require("express")());

app.get("/", (req, res) => {
  res.send({ msg: "DMS Server is up and running" });
});

app.use("/", require("./userRoutes/userRoutes"));
app.use("/dms", require("./dmsRoutes/dmsRoutes"));

// Catch Invalid routes
app.all("*", (req, res) => {
  res.status(404).send({
    error: "Request url '" + req.originalUrl + "' not found",
  });
});
