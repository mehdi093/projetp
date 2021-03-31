const Sauce = require('../models/sauces');
const fs = require('fs');

// creation sauce
exports.creeSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete req.body.userId;
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // likes:0,
        // dislikes:0,

    });
    console.log('body userId', sauce.userId)

    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce créé !' }))
        .catch(error => res.status(400).json({ error }));
};

// on demande une sauce 
exports.uneSauce = (req, res, next) => {
    // console.log('une sauce')
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
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};


// supprime une sauce
exports.suppSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};




// //dislike / like



exports.likeSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
    console.log( '1er', sauce)
      if (req.body.like === 1) {
        console.log(' 1' ,req.body.like === 1 )
        if('likes'){
          console.log('like')
          const  sauce = new Sauce ({
            usersLiked: req.body.userId,
            likes: req.body.like++
          })
           sauce.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }))
          
          console.log('id',sauce)
          sauce.like ++;
        }
          
      } 
       if (req.body.like === 0) {
        console.log(' 0',req.body.like === 0)
        if('likes 0 '){
          console.log('annule')
        //   usersLiked.pop(userId)
          sauce.likes++;
        }
        if('dislike'){
          console.log('dislike 0')
        //   usersDisliked.pop(userId)
          sauce.dislikes =-1;
        }

      } else if (req.body.like === -1) {
        console.log(' -1')
        if('dislikes'){
          console.log('dislike')
          // usersDisliked.push(userId)
          sauce.dislikes--;
        } 
      }
      sauce.save()
      console.log('sauvegarde',sauce)
      .then(() => {res.status(201).json({ message: 'Évaluation enregistrée avec succès!'})
      })
    }
  ) 
  .catch((error) => {res.status(400).json({error: error });
    }
  );   

} 