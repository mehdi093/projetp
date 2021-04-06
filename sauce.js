const Sauce = require('../models/sauces');
const fs = require('fs');
const { db } = require('../models/sauces');
const { Console } = require('console');

// creation sauce
exports.creeSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete req.body.userId;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  console.log('body userId', sauce.userId)

  sauce.save()
    .then(() => res.status(201).json({ message: 'sauce créé !' }))
    .catch(error => res.status(400).json({ error }));
};

// on demande une sauce 
exports.uneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));

};


// on recoit les sauce 
exports.recoitSauce = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};
// modifie une sauce
exports.modifSauce = (req, res, next) => {
  console.log('sauce change')
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};


// supprime une sauce
exports.suppSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};




// //dislike / like



exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      const like = {};
      if (req.body.like === 1) {
        // like.$addToSet = { usersLiked: req.body.userId };
        sauce.usersLiked.$addToSet = { usersLiked: req.body.userId };
        sauce.likes--;
console.log(like,'1','sauce.like',sauce.usersLiked)
      };
      if (req.body.like === 0) {
     
        if (sauce.usersLiked.includes(req.body.userId)) {   console.log(like,'0')
          sauce.likes--;
          like.$pull = { usersLiked: req.body.userId };
        }else if (sauce.usersDislikes.includes(req.body.userId)) {
          sauce.dislikes++;
          like.$pull = { usersDislikes: req.body.userId };
        };


    };
      if (req.body.like === -1) {
        like.$addToSet = { usersDislikes: req.body.userId };
        sauce.dislikes++;
      }
      sauce.save()
        .then(() => {
          res.status(201).json({ message: 'Évaluation enregistrée avec succès!' })
        });
    }
  )
    .catch((error) => {
      res.status(400).json({ error: error });
    }
    );

};