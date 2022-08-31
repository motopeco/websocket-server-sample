import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyCookie from '@fastify/cookie'
import FastifyCors, { FastifyCorsOptions } from '@fastify/cors'
import FastifyWebSocket from '@fastify/websocket'
import * as path from 'path'

const fastify = Fastify({
  logger: true
})

fastify.register(FastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
})

fastify.register(FastifyCookie, {
  secret: "my-secret", // for cookies signature
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {
  }
})

fastify.register(FastifyCors, {
  origin: 'http://localhost:5173',
  preflight: true,
  credentials: true
} as FastifyCorsOptions)

fastify.register(FastifyWebSocket)
fastify.register(async function (fastify) {
  fastify.get('/websocket', { websocket: true }, (con, req) => {
    console.log(req.cookies)
    con.socket.on('message', message => {
      console.log(message)
    })
  })
})

fastify.post('/login', (request, reply) => {
  reply
    .setCookie('auth', 'foo').send('ok')
})

fastify.post('/logout', (request, reply) => {
  reply.clearCookie('auth')
  reply.send('ok')
})
fastify.listen({ port: 3000 })
