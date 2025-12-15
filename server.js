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
    handler: async function (req, reply) {
        const delay = req.query.delay || 0;

        await new Promise((resolve) => setTimeout(resolve, delay));

        // if /?error=true is provided then an error will be triggered
        if (req.query.error) {
            throw new Error("kaboom");
        }

        return { hello: "world" }; // Return a successful response
    },
});

fastify.post("/names", {
    preHandler: fastify.circuitBreaker(),
    handler: async function (request, reply) {
        const { name } = request.body;
        await fastify.redis.set(name, name);

        console.log(`Name ${name} saved`);

        return { message: `Name ${name} saved` };
    },
});

fastify.get("/names", {
    preHandler: fastify.circuitBreaker(),
    handler: async function (request, reply) {
        const names = await fastify.redis.keys("*");
        return { names };
    },
});

// Run the server!
try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
