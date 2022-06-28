const {Router} = require('express');
const {Op} = require("sequelize");
const {Recipe,TypeDiet} = require('../db.js');
const {getAllRecipes, getAallRecipes} = require('../controllers/getRecipes');
const router = Router();

router.get("/", async (req, res) => {
    try {
      const { name } = req.query;
      let allRecipes = await getAllRecipes();
  
      if (name) {
        let recipeByName = await allRecipes.filter((e) =>
          e.name.toLowerCase().includes(name.toString().toLowerCase())
        );
  
        if (recipeByName.length) {
          let recipes = recipeByName.map((e) => {
            return {
              image: e.image,
              name: e.name,
              dietTypes: e.dietTypes ? e.dietTypes : e.diets.map((e) => e.name),
              id: e.id,
            };
          });
          return res.status(200).send(recipes);
        }
        return res.status(404).send("Recipe not found");
      } else {
        let recipes = allRecipes.map((e) => {
          return {
            image: e.image,
            name: e.name,
            dietTypes: e.dietTypes ? e.dietTypes : e.diets.map((e) => e.name),
            id: e.id,
          };
        });
        return res.status(200).send(recipes);
      }
    } catch {
      return res.status(400).send("invalid input");
    }
  });
  
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (id.length > 12) {
        let dbRecipesById = await getDbById(id);
        return res.status(200).json(dbRecipesById);
      } else {
        apiRecipesById = await getApiById(id);
        if (apiRecipesById.data.id) {
          let recipeDetails = {
            image: apiRecipesById.data.image,
            name: apiRecipesById.data.title,
            dishTypes: apiRecipesById.data.dishTypes,
            dietTypes: apiRecipesById.data.diets,
            summary: apiRecipesById.data.summary,
            healthScore: apiRecipesById.data.healthScore,
            steps: apiRecipesById.data.analyzedInstructions[0]?.steps.map((e) => {
              return {
                number: e.number,
                step: e.step,
              };
            }),
          };
          return res.status(200).send(recipeDetails);
        }
      }
    } catch {
      return res.status(404).send("Recipe not found");
    }
  });
  
  router.post("/", async (req, res, next) => {
    try {
      const { name, summary, healthScore, steps, dietTypes, image } = req.body;
      const newRecipe = await Recipe.create({
        name,
        summary,
        healthScore,
        steps,
        dietTypes,
        image,
      });
  
      let dietTypesRecipeDb = await Diet.findAll({
        where: { name: dietTypes },
      });
      newRecipe.addDiet(dietTypesRecipeDb);
      res.status(200).send(newRecipe);
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let updatedRecipe = await Recipe.findOne({
        where: {
          id: id,
        },
      });
      await updatedRecipe.update({
        name: req.body.name,
        summary: req.body.summary,
        healthScore: req.body.healthScore,
        steps: req.body.steps,
        image: req.body.image,
      });
      let dietsFromDb = await Diet.findAll({
        where: {
          name: {
            [Op.in]: req.body.dietTypes,
          },
        },
      });
      await updatedRecipe.setDiets(dietsFromDb);
      res.send(updatedRecipe);
    } catch (error) {
      res.status(400).send({ errorMsg: error });
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const recipeToDelete = await Recipe.findByPk(id);
      if (recipeToDelete) {
        await recipeToDelete.destroy();
        return res.send("Recipe delete!");
      }
      res.status(404).send("Recipe not found.");
    } catch (error) {
      res.status(400).send(error);
    }
  });









module.exports = router;