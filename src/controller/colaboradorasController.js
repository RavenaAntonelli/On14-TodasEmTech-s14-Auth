const colaboradoras = require("../models/colaboradoras")
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const getAll = (req, res) => {
  console.log(req.url);
  const authHeader = req.get('authorization')
  const token = authHeader.split(' ')[1]

  if(!authHeader){//pode trocar o authHeader por token caso não rode
    return res.status(401).send('erro no header')
  }

  jwt.verify(token, SECRET, function(erro){
    if (erro){
      return res.status(405).send('Não autorizado')
    }
   
  colaboradoras.find(function (err, colaboradoras){
      res.status(200).send(colaboradoras)
  })
    })
};

const postColaboradora = (req, res) => {
  const senhaComhash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = senhaComhash

  let colaboradora = new colaboradoras(req.body);
    colaboradora.save(function(err){
    if (err) res.status(500).send({ message: err.message })

    res.status(201).send(colaboradora.toJSON());
  })
};
//rever esse depois
const login = (req, res) => {
  colaboradoras.findOne({ email: req.body}), function(erro, colaboradora){
   if(!colaboradora){
      return res.status(404).send(`Não existe colaboradora com email ${req.body.email}`)
    }
  }

};



module.exports = {
    getAll,
    postColaboradora,
    login
}
