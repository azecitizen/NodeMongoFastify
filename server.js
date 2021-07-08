// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const { ObjectId } = require('mongodb')
const argon2 = require('argon2')
const createError = require('http-errors')
// const jwt = require('fastify-jwt');

fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
})

fastify.register(require('./connector'))

// importation des routes heroes
fastify.register(require('./src/routes/heroes'))

// importation des routes users
fastify.register(require('./src/routes/users'))

// Declare a route
fastify.get('/', async (request, reply) => {
    // ici on retourne un obj js qui va etre converti en json (JS object notation)
  return { hello: 'world' }
})

fastify.get('/me', function() {
    return { 
        prenom: 'Hugo',
        nom: 'R',
        taf: 'pro'
    }
})


// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

const student = 'Siham'

const data = {
    // cle: valeur
    // student // equivaut a ecrire student: student
    student
}
  