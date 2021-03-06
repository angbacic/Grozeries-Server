const { Router } = require('express')
const { toJWT } = require('./jwt')

const User = require('../models').user
const Order = require('../models').Order
const bcrypt = require('bcrypt')


const router = new Router()

router.post('/logins', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    res.status(400).send({
      message: 'Please supply a valid email and password'
    })
  }
  else {
    User
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: 'User with that email does not exist'
          })
        }
        if (bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({
            jwt: toJWT({ userId: entity.id }),
            first_name: entity.first_name,
            last_name: entity.last_name,
            email: entity.email,
            street_name: entity.street_name,
            house_number: entity.house_number,
            zipcode: entity.zipcode,
            city: entity.city,
            phonenumber: entity.phonenumber,
            id: entity.id,
            user_type: entity.user_type,
            // orderid: entity.orderId
          })
        }
        else {
          res.status(400).send({
            message: 'Password was incorrect'
          })
        }
      })
      // .then(console.log("ENTITY",req))
      .catch(err => {
        console.error(err)
        res.status(500).send({
          message: 'Something went wrong'
        })
      })
  }
})

module.exports = router