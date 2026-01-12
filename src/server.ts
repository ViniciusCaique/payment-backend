import { fastifySwagger } from "@fastify/swagger";
import { fastify } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import z4 from "zod/v4";
import { paymentRoutes } from "./modules/payment/infra/routes/payment-routes";

export const app = fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "SampleApi",
			description: "Sample backend service",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(import("@scalar/fastify-api-reference"), {
	routePrefix: "/docs",
});

app.register(paymentRoutes, {
	prefix: "/api/payment",
});

app.setErrorHandler((error, _, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.code(400).send({
			error: "Request Validation Error",
			message: error.validation?.[0]?.message ?? "Validation error",
			issues: error.validation,
		});
	}

	if (isResponseSerializationError(error)) {
		return reply.status(500).send({
			error: "Internal Server Error",
			message: "Response doesn't match the schema",
			issues: error.cause.issues,
		});
	}

	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: z4.treeifyError(error) });
	}

	app.log.error({ err: error }, "Error");

	return reply.status(500).send({ message: "Internal Server Error" });
});

app.listen({ host: "0.0.0.0", port: 3000 }).then(() => {
	app.log.info(`HTTP Server is running on Port 3000`);
});
