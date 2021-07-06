// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// cnx bdd
fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  
  url: 'mongodb://localhost:27017/superheroes'

})

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

const avengers = ['Batman', 'Wolverine', 'Flash']

// get, obtient heroes
fastify.get('/heroes', () => {
    return avengers
})

// post ajout un hero
fastify.post('/heroes', (request,reply) => {
  const col = fastify.mongo.db.collection("heroes")
  col.insertOne(request.body)
  // col.insertOne({
  //   name: request.body.name,
  //   powerstats: request.body.powerstats
  // })
  return null
  // <> a 42 reply.send(null)
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
  