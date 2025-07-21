const Company = require("../models/companyModel.model");
const hybridCompanyID = require("./customIDGenerator.util");


const uniqueCompanyId = async()=>{
    let companyCustomId;
    let exists =true;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;
    //keep generating until an unused ID is found

    do{
        companyCustomId = hybridCompanyID();
        exists= await Company.exists({companyCustomId});
        attempts++;
        if (attempts > MAX_ATTEMPTS){
            throw new Error("Too many ID collisions. Try again or increase ID length.")
        }
    }while(exists)

    return companyCustomId;
}

module.exports = uniqueCompanyId;