const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { verify } = require('crypto');


let dbUsers = [
  {
    username: "yee cinn",
    password: "123456",
    email:"kobe0@gmail.com"
},{
  username: "gg",
  password: "34343",
  email:"wee0@gmail.com"
},{
  username: "nononn",
  password: "whatthe",
  email:"beee0@gmail.com"
}]



  app.get('/bye', (req, res) => {
    res.send('byebye world')
  })

  app.get('/cinn', (req, res) => {
    res.send('Hi cinn')
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  //must write to decode the json file
  app.use(express.json());

  app.post('/', (req, res) => {
    let data = req.body;
    //JSON.stringify(data)
    // res.send('Post request' + data.username);
    //res.send(' Post request' + JSON.stringify(data))
    res.send(
        login(
          data.username,
          data.password
        )
    )  
  })


  // create a post route for user to login
  app.post('/login', (req, res) => {
    //get username and password
    const data = req.body;
    const user = login(data.username, data.password, data.email)
    res.send(generateToken(user))
  })


  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


  function login(username, password){
    console.log("Someone try to login with", username, password)
    let matched = dbUsers.find(Element=>
        Element.username == username
    )
    if(matched){
        if(matched.password==password){
            return matched
        }else{
            return "password is not matched"
        }
    }else{
        return "username not found"
    }

}

function register(newusername, newpassword, newemail){
  //todo: check if username exist
  let matched = dbUsers.find(Element=>
      Element.username == newusername
  )
  if(matched){
    // will not show in the client but in the server
      console.log("Username exist");
    //will show to the client
      return "username exist"
  }else{
          dbUsers.push({
              username: newusername,
              password: newpassword,
              email: newemail
          })
          console.log("push successfully");
          return "success"   
      }

 
}

app.post('/register', (req, res) => {
  let data = req.body
  res.send(
      register(
        data.x,
        data.y,
        data.z
      )
  )  
});

app.get('/hello',verifyToken, (req, res)=>{
    // console.log(req.user)
    res.send('hello World')
})

//to verify JWT Token
function verifyToken(req, res, next){
    let header = req.headers.authorization
    //to paste it in the cmd
    console.log(header);

    //split the bearer token 
    // take the index 1 , to exclude the bearer words
    let token = header.split(' ')[1];
    // secret verify must be same with secret in the generated
    jwt.verify(token, 'secret', function(err, decoded){
        if(err){
            res.send('Invalid token')
        }
        //req.user = decoded
        console.log(decoded);
        next()
    });
}

//to generate jwt token 
function generateToken(userProfile){
    return jwt.sign(
        userProfile
      , 'secret' // the passwordd
      , { expiresIn: 60 * 60 } // 60 * 60  = 1hour expiration 
      );
}