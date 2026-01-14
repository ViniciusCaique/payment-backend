// src/server.ts
import { fastifySwagger } from "@fastify/swagger";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import z4 from "zod/v4";

// src/modules/payment/domain/payment.ts
import z from "zod/v4";
var validateCPF = (cpf) => {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++)
    sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (11 - i);
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10), 10)) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (12 - i);
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11), 10)) return false;
  return true;
};
var cpfSchema = z.string().min(11, "CPF must be at least 11 characters").transform((val) => val.replace(/\D/g, "")).refine(validateCPF, "Invalid CPF");
var getPaymentId = z.object({
  id: z.string()
});
var getPaymentsFilters = z.object({
  document: cpfSchema.optional(),
  paymentMethod: z.enum(["PIX", "CREDIT_CARD"]).optional()
});
var getPaymentsResponse = z.object({
  data: z.object({
    payment: z.array(
      z.object({
        id: z.string()
      })
    )
  })
});
var getPaymentResponse = z.object({
  data: z.object({
    payment: z.object({
      id: z.string()
    })
  })
});
var createPaymentBody = z.object({
  document: cpfSchema,
  description: z.string(),
  amount: z.number(),
  paymentMethod: z.enum(["PIX", "CREDIT_CARD"])
});
var createPaymentResponse = z.object({
  data: z.object({
    payment: z.object({
      id: z.string()
    })
  })
});
var updatePaymentBody = z.object({
  status: z.enum(["PENDING", "PAID", "FAIL"])
});
var updatePaymentResponse = z.object({
  message: z.string()
});

// src/modules/payment/domain/repository-types.ts
import z2 from "zod/v4";
var paymentStatusEnum = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAIL: "FAIL"
};
var paymentMethodEnum = {
  PIX: "PIX",
  CREDIT_CARD: "CREDIT_CARD"
};
var createPaymentSchema = z2.object({
  id: z2.string(),
  document: z2.string().min(1),
  description: z2.string().min(1),
  amount: z2.number().positive(),
  paymentMethod: z2.enum(["PIX", "CREDIT_CARD"]),
  status: z2.enum(["PENDING", "PAID", "FAIL"]),
  createdAt: z2.date().optional(),
  updatedAt: z2.date().optional()
});

// src/modules/payment/infra/repositories/in-memory/in-memory-payment-repository.ts
import { randomUUID } from "crypto";
var InMemoryPaymentRepository = class {
  payments = [];
  async findByFilters(filters) {
    const { document, paymentMethod } = filters;
    return this.payments.filter((payment) => {
      const matchesDocument = document ? payment.document === document : true;
      const matchesMethod = paymentMethod ? payment.paymentMethod === paymentMethod : true;
      return matchesDocument && matchesMethod;
    });
  }
  async findById(id) {
    const payment = this.payments.find((payment2) => payment2.id === id);
    if (!payment) {
      return void 0;
    }
    return payment;
  }
  async create(data) {
    const payment = {
      id: randomUUID(),
      description: data.description,
      document: data.document,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: paymentStatusEnum.PENDING,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments.push(payment);
    return payment;
  }
  async update(id, data) {
    const existingPayment = this.payments.find((payment) => payment.id === id);
    const paymentIndex = this.payments.findIndex(
      (payment) => payment.id === id
    );
    if (paymentIndex === -1) {
      return void 0;
    }
    if (!existingPayment) {
      return void 0;
    }
    const updatedPayment = {
      id: existingPayment.id,
      document: data.document ?? existingPayment.document,
      description: data.description ?? existingPayment.description,
      amount: data.amount ?? existingPayment.amount,
      paymentMethod: data.paymentMethod ?? existingPayment.paymentMethod,
      status: data.status ?? existingPayment.status,
      createdAt: existingPayment.createdAt,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments[paymentIndex] = updatedPayment;
  }
};

// src/modules/payment/application/usecases/create-payment.ts
import { randomUUID as randomUUID2 } from "crypto";
var CreatePaymentUseCase = class {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute({ data }) {
    if (data.paymentMethod === paymentMethodEnum.CREDIT_CARD) {
    }
    const payment = await this.paymentRepository.create({
      id: randomUUID2(),
      amount: data.amount,
      description: data.description,
      document: data.document,
      paymentMethod: data.paymentMethod,
      status: paymentStatusEnum.PENDING
    });
    return {
      payment
    };
  }
};

// src/modules/payment/application/factories/make-create-payment.ts
function makeCreatePaymentUseCase() {
  const paymentRepository = new InMemoryPaymentRepository();
  const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository);
  return createPaymentUseCase;
}

// src/modules/payment/infra/controllers/create-payment-controller.ts
async function createPaymentController(request, reply) {
  try {
    const data = createPaymentBody.parse(request.body);
    const service = makeCreatePaymentUseCase();
    const response = await service.execute({ data });
    return reply.status(200).send({ data: response });
  } catch (error) {
    throw error;
  }
}

// src/shared/errors/not-found.ts
var NotFound = class extends Error {
};

// src/modules/payment/application/usecases/get-payment.ts
var GetPaymentUseCase = class {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute({ id }) {
    const existingPayment = await this.paymentRepository.findById(id);
    if (!existingPayment) {
      throw new NotFound();
    }
    return {
      existingPayment
    };
  }
};

// src/modules/payment/application/factories/make-get-payment.ts
function makeGetPaymentUseCase() {
  const paymentRepository = new InMemoryPaymentRepository();
  const getPaymentUseCase = new GetPaymentUseCase(paymentRepository);
  return getPaymentUseCase;
}

// src/modules/payment/infra/controllers/get-payment-by-id-controller copy.ts
async function getPaymentByIdController(request, reply) {
  try {
    const { id } = getPaymentId.parse(request.params);
    const service = makeGetPaymentUseCase();
    const response = await service.execute({ id });
    return reply.status(200).send({ data: response });
  } catch (error) {
    if (error instanceof NotFound) {
      return reply.status(404).send({
        message: error.message
      });
    }
    throw error;
  }
}

// src/modules/payment/application/usecases/get-payments.ts
var GetPaymentsUseCase = class {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute({ document, paymentMethod }) {
    const filters = {};
    if (document) filters.document = document;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    const existingPayment = await this.paymentRepository.findByFilters(filters);
    if (existingPayment.length === 0) {
      throw new NotFound();
    }
    return {
      existingPayment
    };
  }
};

// src/modules/payment/application/factories/make-get-payments.ts
function makeGetPaymentsUseCase() {
  const paymentRepository = new InMemoryPaymentRepository();
  const getPaymentsUseCase = new GetPaymentsUseCase(paymentRepository);
  return getPaymentsUseCase;
}

// src/modules/payment/infra/controllers/get-payments-controller.ts
async function getPaymentsController(request, reply) {
  try {
    const { document, paymentMethod } = getPaymentsFilters.parse(
      request.params
    );
    const service = makeGetPaymentsUseCase();
    const response = await service.execute({
      document,
      paymentMethod
    });
    return reply.status(200).send({ data: response });
  } catch (error) {
    if (error instanceof NotFound) {
      return reply.status(404).send({
        message: error.message
      });
    }
    throw error;
  }
}

// src/modules/payment/application/usecases/update-payment.ts
var UpdatePaymentUseCase = class {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute({ id, data }) {
    const existingPayment = await this.paymentRepository.findById(id);
    if (!existingPayment) {
      throw new NotFound();
    }
    await this.paymentRepository.update(id, data);
  }
};

// src/modules/payment/application/factories/make-update-payment.ts
function makeUpdatePaymentUseCase() {
  const paymentRepository = new InMemoryPaymentRepository();
  const updatePaymentUseCase = new UpdatePaymentUseCase(paymentRepository);
  return updatePaymentUseCase;
}

// src/modules/payment/infra/controllers/update-payment-controller.ts
async function updatePaymentController(request, reply) {
  try {
    const { id } = getPaymentId.parse(request.params);
    const data = updatePaymentBody.parse(request.body);
    const service = makeUpdatePaymentUseCase();
    const response = await service.execute({ id, data });
    return reply.status(200).send({ data: response });
  } catch (error) {
    if (error instanceof NotFound) {
      return reply.status(404).send({
        message: error.message
      });
    }
    throw error;
  }
}

// src/modules/payment/infra/routes/payment-routes.ts
async function paymentRoutes(app2) {
  app2.get(
    "",
    {
      schema: {
        tags: ["Payment"],
        summary: "Get Payments",
        description: "Get Payments",
        querystring: getPaymentsFilters,
        response: { 200: getPaymentsResponse }
      }
    },
    getPaymentsController
  );
  app2.get(
    "/:id",
    {
      schema: {
        tags: ["Payment"],
        summary: "Get Payment By Id",
        description: "Get Payment By Id",
        params: getPaymentId,
        response: { 200: getPaymentResponse }
      }
    },
    getPaymentByIdController
  );
  app2.post(
    "/",
    {
      schema: {
        tags: ["Payment"],
        summary: "Create Payment",
        description: "Create Payment",
        body: createPaymentBody,
        response: { 201: createPaymentResponse }
      }
    },
    createPaymentController
  );
  app2.patch(
    "/",
    {
      schema: {
        tags: ["Payment"],
        summary: "Update Payment",
        params: getPaymentId,
        body: updatePaymentBody,
        response: { 200: createPaymentResponse }
      }
    },
    updatePaymentController
  );
}

// src/server.ts
var app = fastify({
  logger: true
}).withTypeProvider();
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "SampleApi",
      description: "Sample backend service",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(import("@scalar/fastify-api-reference"), {
  routePrefix: "/docs"
});
app.register(paymentRoutes, {
  prefix: "/api/payment"
});
app.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: "Request Validation Error",
      message: error.validation?.[0]?.message ?? "Validation error",
      issues: error.validation
    });
  }
  if (isResponseSerializationError(error)) {
    return reply.status(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      issues: error.cause.issues
    });
  }
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: z4.treeifyError(error) });
  }
  app.log.error({ err: error }, "Error");
  return reply.status(500).send({ message: "Internal Server Error" });
});
app.listen({ host: "0.0.0.0", port: 3e3 }).then(() => {
  app.log.info(`HTTP Server is running on Port 3000`);
});
export {
  app
};
