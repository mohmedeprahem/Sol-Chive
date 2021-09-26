import joi from 'joi';

const schema = joi.object({
    title: joi.string()
    .min(1)
    .max(50)
    .required(),

    link: joi.string()
        .min(3)
        .max(100)
        .required(),
    
    source: joi.string()
        .min(1)
        .max(100)
        .required(),

    my_solution: joi.string()
        .max(65535)
        .required(),

    perfect_solution: joi.string()
        .max(65535)
});

export default schema;