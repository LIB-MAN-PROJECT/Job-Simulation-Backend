const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

//Ensuring the storage file directory exists
const ensureDir = async (dirPath) =>{
    try {
        await fs.mkdir(dirPath,{recursive: true});
    } catch (error) {
        console.error("Failed to create upload dir:",err);
        throw new Error("Couldn't prepare upload folder.");
    }
};


//Image Upload Configuration
const imageStorage = multer.diskStorage({
    destination: async(req,file,cb)=>{
        const folder = "uploads/images";
        try {
            await ensureDir(folder);
            cb(null,folder);
        } catch (error) {
            cb(error,folder);
        }
    },
    filename: (req,file,cb)=>{
        const fileName= Date.now()+'-'+file.originalname;
        cb(null,fileName);
    },
});

const imageFileFilter = (req,file,cb) =>{
    const allowed=["image/jpeg","image/jpg","image/png"];
    if(allowed.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Only JPEG,JPG and PNG files are allowed"),false);
    }
};

const uploadImage = multer({
    storage:imageStorage,
    fileFilter: imageFileFilter,
    limits: {fileSize: 5 * 1024 *1024}, //5MB
});


//Document Upload
const docStorage = multer.diskStorage({
    destination: async(req,file,cb)=>{
        const folder = "uploads/douments";
        try {
            await ensureDir(folder);
            cb(null,folder);
        } catch (error) {
            cb(error,folder);
        }
    },
    filename: (req,file,cb)=>{
        const fileName= Date.now()+'-'+file.originalname;
        cb(null,fileName);
    },
});

const docFileFilter = (req,file,cb) => {
    const allowed = ["application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",];
    if(allowed.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(new Error("Only PDF,DOC and DOCX files are allowed"),false);
    }
}

const uploadDocument = multer({
    storage: docStorage,
    fileFilter: docFileFilter,
    limits: {fileSize: 10 * 1024 * 1024}//10MB
});

module.exports={uploadImage,uploadDocument};