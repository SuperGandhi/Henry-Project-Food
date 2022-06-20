const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const recipeRouter = require('./recipe');
const recipesRouter = require('./recipes');
const typesRouter = require('./types')

const router = Router();

// Configurar los routers
router.use('/recipe', recipeRouter);
router.use('/recipes', recipesRouter);
router.use('/types', typesRouter);


// Ejemplo: router.use('/auth', authRouter);
module.exports = router;
