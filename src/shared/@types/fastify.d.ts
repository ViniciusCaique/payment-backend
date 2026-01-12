import "fastify";

declare module "fastify" {
	interface FastifyTypeProvider extends ZodTypeProvider {}
}