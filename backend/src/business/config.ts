import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Business Express API with Swagger",
			version: "0.1.1",
			description: "This is a simple CRUD API application made with Express and documented with Swagger",
		},
	},
	apis: ["./src/business/routes/*.ts"],
};
const swagger_specs = swaggerJsdoc(options);
export default {
	swagger_specs
};