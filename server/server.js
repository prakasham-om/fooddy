import app from './app.js'

import dataBaseConnection from './DB/database.js';


dataBaseConnection();

app.listen(8000,(err)=>{
   if(err) throw err

   console.log("server runnig");
})