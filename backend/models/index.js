const db = require("mongoose");  

db.set("useNewUrlParser", true); 
db.set("useUnifiedTopology", true); 
db.set("useFindAndModify", false);

module.exports = models= {};

const DB_URL = "mongodb://localhost:27017/medium_test"; 

models.init = async() =>{
    console.log("connecting database at ",DB_URL);
    try{
        await db.connect(DB_URL); 
        console.log(`database connected`); 
    }catch(err){
        console.error(err);
    throw err; 
    }
}
