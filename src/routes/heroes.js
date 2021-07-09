async function routes(fastify, options) {
const { ObjectId } = require('mongodb')
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
}

module.exports = routes