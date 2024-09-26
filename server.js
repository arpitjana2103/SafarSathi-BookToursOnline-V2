const { app } = require("./app");

const port = 3000;
app.listen(port, function () {
    console.log(`API URL : http://127.0.0.1:${port}/`);
});
