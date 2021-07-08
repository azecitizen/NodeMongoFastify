// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const { ObjectId } = require('mongodb')

// cnx bdd
fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  
  // url: 'mongodb://localhost:27017/superheroes'
  url: 'mongodb://localhost:27017/bdd-test'

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
fastify.get('/heroes', async (request, reply) => {
  const col = fastify.mongo.db.collection('heroes')
  const res = await col.find({}).toArray()
    return res
})

// get, heroe 69
fastify.get('/heroes/:heroesId', async (request, reply) => {
  const col = fastify.mongo.db.collection('heroes')
  // const heroesId= request.params.heroesId <> ligne 42
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  const { heroesId }= request.params
  const res = await col.findOne({
    _id: new ObjectId(heroesId)
  })
  return res
})

fastify.get('/heroes/bio/:heroesId', async (request, reply) => {
	const collection = fastify.mongo.db.collection('heroes')
	const { heroesId } = request.params
	const result = await collection.findOne({
		_id: new ObjectId(heroesId)
	})
  const { name, biography, powerstats: { intelligence, speed } } = result
  // const { intelligence, speed } = powerstats
  // equivalent a:
  // const name = result.name
  // const biography = result.biography
  // const powerstats = result.powerstats
	// destructuration Template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	return `${name} connu sous le nom de ${result.biography['full-name']}. Je suis née à ${biography['place-of-birth']}. J'ai ${ intelligence } en intelligence, et ${ speed } en vitesse.`
})

// post ajout un hero
fastify.post('/heroes', async (request, reply) => {
  const col = fastify.mongo.db.collection('heroes')
  const result =  await col.insertOne(request.body)
  // col.insertOne({
  //   name: request.body.name,
  //   powerstats: request.body.powerstats
  // })
  return result.ops[0]
  // <> a 42 reply.send(null)
})

// delete

fastify.delete('/heroes/:heroesId', async (request, reply) => {
  const col = fastify.mongo.db.collection('heroes')
  const { heroesId } = request.params
  const result =  await col.findOneAndDelete({
    _id: new ObjectId(heroesId)
  })
  // DeleteOne n'affiche pas les infos de ce qui a ete sup
  return result
})

fastify.patch('/heroes/:id', async (request, reply) => {
  const col = fastify.mongo.db.collection('heroes')
  const { id } = request.params
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(id) }, 
    { $set: request.body },
    { returnDocument: 'after'}
  )
  return res
})

// CRUD user

// post user
fastify.post('/users', async (request, reply) => {
  // request toutes les infos dans le requete
  const col = fastify.mongo.db.collection('users')
  const res =  await col.insertOne(request.body)
  return res.ops[0]
})

// get users
fastify.get('/users', async (request, reply) => {
  const col = fastify.mongo.db.collection('users')
  const res = await col.find({}).toArray()
    return res
})

// get user by id
fastify.get('/users/:id', async (request, reply) => {
  const col = fastify.mongo.db.collection('users')
  // si collection n'existe pas ca va aussi la creer
  const { id }= request.params
  const res = await col.findOne({
    _id: new ObjectId(id)
  })
  return res
})

// patch by id
fastify.patch('/users/:id', async (request, reply) => {
  const col = fastify.mongo.db.collection('users')
  const { id } = request.params
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(id) }, 
    { $set: request.body },
    { returnDocument: 'after'}
  )
  return res
  // ou reply.code(200).send(result)
})

// del by id
fastify.delete('/users/:id', async (request, reply) => {
  const col = fastify.mongo.db.collection('users')
  const { id } = request.params
  const res =  await col.findOneAndDelete({
    _id: new ObjectId(id)
  })
  return res
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
  