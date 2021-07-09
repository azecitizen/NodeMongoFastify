async function routes(fastify, options) {
 
fastify.post('/login', async (request, reply) => {
    const argon2 = require('argon2')  
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
}

module.exports = routes