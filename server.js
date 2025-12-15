// Import the framework and instantiate it
import fastifyCircuitBreaker from "@fastify/circuit-breaker";
import fastifyRedis from "@fastify/redis";
import Fastify from "fastify";

const fastify = Fastify({
    logger: true,
});

await fastify.register(fastifyRedis, {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: 6379,
});

await fastify.register(fastifyCircuitBreaker);

fastify.get("/", {
    preHandler: fastify.circuitBreaker(),
    handler: async function (request, reply) {
        setTimeout(() => {
            reply.send(
                req.query.error ? new Error("kaboom") : { hello: "world" },
            );
        }, req.query.delay || 0);
    },
});

fastify.post("/names", async function handler(request, reply) {
    const { name } = request.body;
    await fastify.redis.set(name, name);
    return { message: `Name ${name} saved` };
});

fastify.get("/names", async function handler(request, reply) {
    const names = await fastify.redis.keys("*");
    return { names };
});

// Run the server!
try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
