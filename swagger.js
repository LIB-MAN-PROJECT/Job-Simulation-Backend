const swaggerAutogen = require("swagger-autogen");

const doc={
    info: {
        title: "Job Simulation Management API",
        description: `A RESTful API for providing and managing Job Simulations and Internships for users who need to enter the job market but have no idea of the skills they need to thrive in their respective fields
        
        ## Key Features
        `
    },
    host: "job-simulation-backend-3e6w.onrender.com",
    schemes:["https"],
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