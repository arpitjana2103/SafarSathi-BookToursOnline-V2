const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { app } = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`API URL : http://127.0.0.1:${port}/`);
});
