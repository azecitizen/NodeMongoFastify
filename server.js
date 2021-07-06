// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
    // ici on retourne un obj js qui va etre converti en json (JS object notation)
  return { hello: 'world' }
})

fastify.get('/me', function() {
    return { 
        prenom: 'Hugo',
        nom: 'R',
        taf: 'glandeur pro'
    }
})

const avengers = ['Batman', 'Wolverine', 'Flash']

fastify.get('/avengers', () => {
    return avengers
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
  