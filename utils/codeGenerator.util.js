const codeGenerator= async (length)=>{
    const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

    let code = '';

    for(let i = 0; i<length; i++){
        code += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    console.log("code",code)
    return code;
}

module.exports = codeGenerator;