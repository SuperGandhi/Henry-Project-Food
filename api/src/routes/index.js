const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const recipesRoutes = require('./recipes');
const dietsRoutes = require('./diets')

const router = Router();

// Configurar los routers
router.use('/recipes', recipesRoutes);
router.use('/diets', dietsRoutes);


// Ejemplo: router.use('/auth', authRouter);
module.exports = router;
