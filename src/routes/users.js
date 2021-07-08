async function routes(fastify, options) {
// CRUD user

// post user
fastify.post('/users', async (request, reply) => {
    try {
    // request toutes les infos dans le requete
    const col = fastify.mongo.db.collection('users')
  
    const { email, pwd, role } = request.body
    // collection.findOne({ email : email }) = 111
    const userExist = await col.findOne({ email })
    
  
    if (userExist){
      throw new Error("Email already exists")
      // error arrete directement le process et passe directement au catch error
    }
  
    if(pwd.length<4){
      return createError.NotAcceptable("Password too short")
    }
  
      const hash = await argon2.hash(pwd)
      const newUser = {
        email: request.body.email,
        pwd: hash, 
        role: request.body.role
      }
      const res =  await col.insertOne(newUser)
      reply.code(201).send(res.ops[0])
    } catch (err){
      console.error(err)
      // reply.code(409).send({msg: err.msg})
      return createError(500, err.message)
      //ou
      // return createError.Conflict(err.msg)
    }
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
  
  fastify.post('/login', async (request, reply) => {
    const { email, pwd } = request.body
    const col = fastify.mongo.db.collection('users')
    const userExist = await col.findOne({ email })
  
    if(!userExist) {
      return createError(400, "Incorrect email or password")
    }
    console.log(userExist.pwd)
    const match = argon2.verify(userExist.pwd, pwd)
  
    if(!match) {
      return createError(400, "Incorrect email or password")
    }
  
    const token = fastify.jwt.sign({ id: userExist._id, role: userExist.role })
      return { token }
  })
  
  fastify.get('/protected', async (request, reply) => {
  // Si l'utilisateur ne m'envoie pas de token, je dois lui retourner une erreur
      // Sinon, je lui retourne un objet contenant la propriété message avec Bienvenue comme valeur
    await request.jwtVerify()
    return { message: "Welcome" }
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
}
  module.exports = routes