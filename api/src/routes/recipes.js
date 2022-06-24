const {Router} = require('express');
const {Recipe,Diet} = require('../db.js');
const axios = require('axios').default;
const {API_KEY} = process.env

router.get('/',getAallRecipes)

router.get('/:id',async (req,res) =>{
    const {id} = req.params
    const allRecipes = await getAllRecipes()
   // console.log(allRecipes.map(e => e.id===parseInt(id)));
    let validate = id.includes("-"); // si tiene el guion es porque se encuentra en la base de datos

    if (validate) {
    try {
        let dbId = await Recipe.findByPk(id, { include: TypeDiet });  // entonce la busco directo de la base de datos
        res.status(200).json([dbId]);
    } catch (err) {
        console.log(err);
    }
    }
    
else {
    try {
    if (id) {
        let recipeId = await allRecipes.filter((el) => el.id === parseInt(id)
        );
       // console.log(recipeId);
        recipeId.length
        ? res.status(200).send(recipeId)
        : res.status(400).send("Not fuound");
    }
    } catch (err) {
    res.json({ message: err });
    }
}

router.post('/', async (req,res,next) => {
    let {
        title,
        summary,
        spoonacularScore,
        healthScore,
        analyzedInstructions,
        createdInDb,
        typeDiets
    } = req.body;
    if(!title || !summary) {
        return res.status(400).send('Please, insert a title and a summary to continue!');
    }
    console.log(title);
try{let createRecipe = await Recipe.create({
       // id,     
        title,
        summary,
        spoonacularScore ,
        healthScore,
        analyzedInstructions,
       // typeDiet,
        createdInDb
})
let dietTypeDb = await TypeDiet.findAll({ where:{ name:typeDiets } })
    createRecipe.addTypeDiet(dietTypeDb)
    res.status(200).send('receta creada')   

}catch(e){
    next(e)
}
});
});










module.exports = router;