const db = require('./db');

let accountDetails={
    1001:{name:"user1", acno:1001, pin:1234, password:'userone', balance:3000, transactions:[]},
    1002:{name:"user2", acno:1002, pin:2345, password:'usertwo', balance:2500, transactions:[]},
    1003:{name:"user3", acno:1003, pin:3456, password:'userthree', balance:3500, transactions:[]},
    1004:{name:"user4", acno:1004, pin:4567, password:'userfour', balance:4000, transactions:[]},
    1005:{name:"user5", acno:1005, pin:5678, password:'userfive', balance:5000, transactions:[]},
}
let currentUser;

const register = (name,acno,pin,password)=>{
    return db.User.findOne({
      acno:acno
    })
    .then(user=>{
      if(user){
        return {
          status:false,
          statusCode:422,
          message:'Account already exists. Please login'
        }
      }
      const newUser = new db.User({
        name,
        acno,
        pin,
        password,
        balance:0,
        transactions:[]
      });
      newUser.save();
      return {
        status:true,
        statusCode:200,
        message:'Account created successfully. Please login'
      };
    });
}

const login = (req,acno1, password)=>{
  var acno=parseInt(acno1);
  return db.User.findOne({
    acno:acno,
    password
  })
  .then(user=>{
    if(user){
      req.session.currentUser=acno;
      return {
          status:true,
          statusCode:200,
          message:'Logged in',
          name:user.name
      }
    }
    return {
        status:false,
        statusCode:422,
        message:'Invalid Credentials'
    }
  })
}

const deposit = (req,dpacno,dppin,dpamt)=>{
  return db.User.findOne({
    acno:dpacno,
    pin: dppin
  })
  .then(user=>{
    if(req.session.currentUser!=dpacno){
      return {
          status:false,
          statusCode:422,
          message:'You are not allowed to make this transaction'
      }
    }
    if(!user){
        return {
            status:false,
            statusCode:422,
            message:'Incorrect Account Details'
        }
    }
    user.balance+= parseInt(dpamt);
    user.transactions.push({
      amount:dpamt,
      typeOfTransaction:'Credit'
    });
    user.save();
    return {
      status:true,
      statusCode:200,
      message:'account has been credited', 
      balance:user.balance
    }
  });
}

const withdraw = (req,wacno,wpin,wamt)=>{
  return db.User.findOne({
    acno:wacno,
    pin: wpin
  })
  .then(user=>{
    if(!user){
        return {
            status:false,
            statusCode:422,
            message:'Incorrect Account Details'
        }
    }
    if(req.session.currentUser!=wacno){
      return {
          status:false,
          statusCode:422,
          message:'You are not allowed to make this transaction'
      }
    }
    if(user.balance<parseInt(wamt)){
      return {
        status:false,
        statusCode:422,
        message:'Insufficient balance', 
        balance:user.balance
      }
    }
    user.balance-= parseInt(wamt)
    user.transactions.push({
      amount:wamt,
      typeOfTransaction:'Debit'
    })
    user.save();
    return {
      status:true,
      statusCode:200,
      message:'account has been debited', 
      balance:user.balance
    }
  })
}

const getTransactions = (req)=>{
  return db.User.findOne({
    acno:req.session.currentUser
  })
  .then(user=>{
    return {
      status:true,
      statusCode:200,
      transactions:user.transactions
    }
  })
}

const deleteTransaction = (req, id)=>{
  return db.User.findOne({
    acno:req.session.currentUser
  })
  .then(user=>{
    user.transactions = user.transactions.filter(t=>{
      if(t._id==id){
          return false;
      }
      return true;
    })
    user.save();
    return {
      status:true,
      statusCode:200,
      message:'Transaction deleted successfully'
    }
  })
}

// getDetails(){
//     if(localStorage.getItem("accountDetails")){
//       this.accountDetails = JSON.parse(localStorage.getItem("accountDetails"));
//     }
//     if(localStorage.getItem("currentUser")){
//       this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     }
// }

module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransactions,
    deleteTransaction
}