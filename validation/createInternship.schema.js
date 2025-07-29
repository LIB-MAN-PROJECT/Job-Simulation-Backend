const Joi = require("joi");
// const { description } = require("./createsimulation.schema");

const createInternshipPostSchema = Joi.object({
  title: Joi.string().trim().required(),
  description:Joi.string().trim().required(),
  //description, // already validated in the imported schema
  field: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  mode: Joi.string().optional()
    .valid('remote', 'hybrid', 'in-person', 'Remote', 'Hybrid', 'In-person'),
  deadline: Joi.date().required()
});

module.exports = createInternshipPostSchema;
// module.exports={description};