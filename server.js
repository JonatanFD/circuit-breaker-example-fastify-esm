// Import the framework and instantiate it
import fastifyRedis from "@fastify/redis";
import Fastify from "fastify";

const fastify = Fastify({
    logger: true,
});

fastify.register(fastifyRedis, {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: 6379,
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
    return { hello: "world" };
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

fastify.delete("/names/:name", async function handler(request, reply) {
    const { name } = request.params;
    await fastify.redis.del(name);
    return { message: `Name ${name} deleted` };
});

// Run the server!
try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
