const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const fs = require("fs")
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Verif JWT
const verification = (req, res, next) => {
  let getHeader = req.headers['auth']
  if (typeof getHeader !== 'undefined') {
    req.token = getHeader
    next()
  } else {
    res.sendStatus(403)
  }
}

// POST LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body

  const users = fs.readFileSync('./data/users.json')
  const usersParsing = JSON.parse(users)

  const user = usersParsing.find((user) => user.username === username)
  if (user && user.password === password) {
    res.send('berhasil login, dapatkan key')
    const data = {
      username: user.username,
      password: user.password,
    }
    jwt.sign(
      {
        data: data,
      },
      'secret',
      (err, token) => {
        console.log('Login berhasil')
        console.log('token:'+ token)
      }
    )
  } else if (user && user.password !== password) {
    res.send('Password Salah')
  } else {
    res.send('Data Ga Valid')
  }
})

//getAllData Teachers
app.get('/teachers', verification, (req, res) => {
  jwt.verify(req.token, 'secret', (err, auth) => {
    if (err) {
      res.sendStatus(403)
    } else {
      const users = fs.readFileSync('./data/teachers.json')
      
      const usersParsing = JSON.parse(users)

      res.json(usersParsing)

      console.log(users);
    }
  })
})

app.listen(port, () => {
  console.log('app ada di port: '+ port)
})