let accountDetails={
    1001:{name:"user1", acno:1001, pin:1234, password:'userone', balance:3000, transactions:[]},
    1002:{name:"user2", acno:1002, pin:2345, password:'usertwo', balance:2500, transactions:[]},
    1003:{name:"user3", acno:1003, pin:3456, password:'userthree', balance:3500, transactions:[]},
    1004:{name:"user4", acno:1004, pin:4567, password:'userfour', balance:4000, transactions:[]},
    1005:{name:"user5", acno:1005, pin:5678, password:'userfive', balance:5000, transactions:[]},
}
let currentUser;

const register = (name,acno,pin,password)=>{
    if (acno in accountDetails){
        return {
          status:false,
          statusCode:422,
          message:'Account already exists. Please login'
        }
    }
    accountDetails[acno]={
        name,
        acno,
        pin,
        password,
        balance:0,
        transactions:[]
    }
    //this.saveDetails();
    return {
        status:true,
        statusCode:200,
        message:'Account created successfully. Please login'
    }
}

const login = (acno1, password)=>{
    var acno=parseInt(acno1);
    var data=accountDetails;
    if (acno in data){
      var pwd = data[acno].password
      if (pwd==password){
        currentUser = data[acno];
        // this.saveDetails();
        return {
            status:true,
            statusCode:200,
            message:'Logged in'
          }
      }
    }
    return {
        status:false,
        statusCode:422,
        message:'Invalid Credentials'
    }
}

const deposit = (dpacno,dppin,dpamt)=>{
    var data=accountDetails;
    if (dpacno in data){
        var mpin = data[dpacno].pin
        if (dppin==mpin){
            data[dpacno].balance+= parseInt(dpamt);
            data[dpacno].transactions.push({
              amount:dpamt,
              type:'Credit'
            })
            //this.saveDetails();
            return {
              status:true,
              statusCode:200,
              message:'account has been credited', 
              balance:data[dpacno].balance
            }
        }
    }
    else{
        return {
            status:false,
            statusCode:422,
            message:'Incorrect Account Details'
        }
    }
}

const withdraw = (wacno,wpin,wamt)=>{
    var data=accountDetails;
    if (wacno in data){
        var mpin = data[wacno].pin
        if(data[wacno].balance<parseInt(wamt)){
          return {
            status:false,
            statusCode:422,
            message:'Insufficient balance', 
            balance:data[wacno].balance
          }
        }
        else if (wpin==mpin){
            data[wacno].balance-= parseInt(wamt)
            data[wacno].transactions.push({
              amount:wamt,
              type:'Debit'
            })
            return {
              status:true,
              statusCode:200,
              message:'account has been debited', 
              balance:data[wacno].balance
            }
        }
    }
    else{
      return {
        status:false,
        statusCode:422,
        message:'Incorrect Account Details'
      }
    }
}

const getTransactions = ()=>{
    return accountDetails[currentUser.acno].transactions;
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
    getTransactions
}