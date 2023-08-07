const express = require("express");
const cluster = require("node:cluster");
const os = require("os");

const totalCPUs = os.cpus().length;

// console.log(totalCPUs); => 8 core cpu  so 8 server will be live
//  clustering will be in round robin manner expect windows
const app = express();
const PORT = 8000;

app.get('/', (req, res) =>{
    res.send(`message: hello from the express server ${process.pid}`);
    cluster.worker.kill();
});

if (cluster.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker,code, singal) =>{
    console.log(`worker ${worker.process.pid}, died`);
    cluster.fork();
  })
}else {
    app.listen(PORT, () =>{
        console.log(`server started At port ${PORT} and cpu process is ${process.pid}`);
    });
}



