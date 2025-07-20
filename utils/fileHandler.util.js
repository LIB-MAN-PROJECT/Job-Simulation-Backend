const fs = require('fs/promises');
const path = require('path');

const getDataFile =(fileName) =>{
    return path.join(__dirname,"../localdata",fileName);
}

console.log("localData File",getDataFile("simulations.json"));

//reading data
async function readData(fileName){
    const filePath = getDataFile(fileName);

    try {
        const data = await fs.readFile(filePath,'utf-8');
        if(!data.trim()) return[];
        return JSON.parse(data);
    } catch (error) {
        if(error.code === "ENOENT") return[];
        throw error;
    }
}

async function WriteData(fileName,data){
    const filePath = getDataFile(fileName);
    try {
        const newData = await fs.writeFile(filePath,JSON.stringify(data,null,2));
        return newData;
    } catch (error) {
        throw error;
    }
}

module.exports ={
    readData,WriteData
}