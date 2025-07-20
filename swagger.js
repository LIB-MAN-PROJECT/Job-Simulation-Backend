const swaggerAutogen = require("swagger-autogen");

const doc={
    info: {
        title: "Job Simulation Management API",
        description: "An API for managing Job Simulations and Internship for a variety of different categories of users"
    },
    host: "http://localhost:3000",
    schemes:["http"],
    components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
//   security: [{ bearerAuth: [] }],
}

const outputFile="./swagger-output.json";
const routes= ["./server.js"];

swaggerAutogen(outputFile,routes,doc);