const express = require('express');
const dataService = require('./services/data.service');
const app = express();

app.use(express.json());

app.get('/', (req,res)=>{
    res.status(401).send("Hello World");
})

app.post('/', (req,res)=>{
    res.send("Post Method");
})

app.post('/register', (req,res)=>{
    const result = dataService.register(req.body.name,req.body.acno,req.body.pin,req.body.password)
    res.status(result.statusCode).json(result);
})

app.post('/login', (req,res)=>{
    const result = dataService.login(req.body.accno,req.body.password)
    res.status(result.statusCode).json(result);
})

app.post('/deposit', (req,res)=>{
    const result = dataService.deposit(req.body.dpacno,req.body.dppin,req.body.dpamt)
    res.status(result.statusCode).json(result);
})

app.post('/withdraw', (req,res)=>{
    const result = dataService.withdraw(req.body.dpacno,req.body.dppin,req.body.dpamt)
    res.status(result.statusCode).json(result);
})

app.get('/transactions', (req,res)=>{
    const result = dataService.getTransactions()
    res.status(200).json(result);
})

app.put('/', (req,res)=>{
    res.send("Put Method");
})

app.patch('/', (req,res)=>{
    res.send("Patch Method");
})

app.delete('/', (req,res)=>{
    res.send("Delete Method");
})

app.listen(3000, ()=>{
    console.log("Server started at port 3000");
})