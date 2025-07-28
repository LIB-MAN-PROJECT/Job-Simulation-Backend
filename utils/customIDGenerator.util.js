const {customAlphabet} = require("nanoid");

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',7);

// const generateCustomID = () =>{
//     const customID = nanoid(7);
//     return customID;
// }

const hybridCompanyID= (prefix='CM') =>{
    const year =new Date().getFullYear().toString().slice(-2);
    const uniqueCode =nanoid();
    const customID= `${prefix}-${year}-${uniqueCode}`;
    return customID;
}

module.exports= hybridCompanyID