const SwaggerUi = require('swagger-ui-express');
var express = require('express');
const fs = require("fs")
const YAML = require('yaml')
const path = require('path');

const filePath = path.join(__dirname, '../docs/swagger.yaml');
const file = fs.readFileSync(filePath, 'utf8');

const swaggerDocument = YAML.parse(file)

const router = express.Router();

router.use('/', SwaggerUi.serve, SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));

module.exports = router;