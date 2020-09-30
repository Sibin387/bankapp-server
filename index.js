const express = require('express');
const dataService = require('./services/data.service');
const session = require('express-session')
const cors = require('cors');

const app = express();

app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))

app.use(session({
    secret:'randomsecurestring',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());

const logMiddleware = (req,res,next) => {
    console.log(req.body);
    next();
};
//app.use(logMiddleware);

const authMiddleware = (req,res,next) => {
    if(!req.session.currentUser){
        return res.status(401).json({
          status:false,
          statusCode:401,
          message:'Please login'
        });
    }else{
        next();
    }
};

app.get('/', (req,res)=>{
    res.status(200).send("Hello World");
})

app.post('/', (req,res)=>{
    res.send("Post Method");
})

app.post('/register', (req,res)=>{
    dataService.register(req.body.name,req.body.acno,req.body.pin,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
    //res.status(200).send("success");
    //res.status(result.statusCode).json(result);
})

app.post('/login', (req,res)=>{
    dataService.login(req, req.body.accno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.post('/deposit', authMiddleware, (req,res)=>{
    dataService.deposit(req, req.body.dpacno,req.body.dppin,req.body.dpamt)
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
})

app.post('/withdraw', authMiddleware, (req,res)=>{
    dataService.withdraw(req, req.body.dpacno,req.body.dppin,req.body.dpamt)
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
})

app.get('/transactions', authMiddleware, (req,res)=>{
    dataService.getTransactions(req)
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
})

app.delete('/transactions/:id', authMiddleware,(req,res)=>{
    dataService.deleteTransaction(req,req.params.id)
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
})

// app.get('/transactions', authMiddleware, (req,res)=>{
//     const result = dataService.getTransactions()
//     res.status(200).json(result);
// })

app.put('/', (req,res)=>{
    res.send("Put Method");
})

app.patch('/', (req,res)=>{
    res.send("Patch Method");
})

app.delete('/', (req,res)=>{
    res.send("Delete Method");
})

const port = 3000;
app.listen(port, ()=>{
    console.log("Server started at port "+port);
})