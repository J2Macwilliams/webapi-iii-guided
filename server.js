const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//middleware----------------------------------------------------
// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`)
  
  next();//allows the request to continue to the next middleware
}

  // Write a gatekeeper middleware that reads a password
  function atGate(req, res, next) {
    console.log('At the Gate about to be eaten')
    next();
}



// server.use(helmet());//<<<<<<<<<<<<<<<<<<use it 2;
server.use(express.json());//built in middleware

server.use('/api/hubs', hubsRouter);// the router is local middleware because it only applies to the api/hubs


server.use(logger())

// endpoints----------------------------------------------------
server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/echo', (req,res) => {
  res.send(req.headers);
})

//invoking it in the endpoint makes it locally
server.get('/area51', atGate(),  (req,res) => {
  // res.send(req.headers);
  if(req.password === 'mellon') {
res.status(200).json({message: "Come on in. The water is fine."})
  }else {
    res.status(401).json({message: "You shall not pass!!!"})
  }
})

// export-------------------------------------------------------
module.exports = server;
