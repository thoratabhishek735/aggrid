import connection from "../DB/config";

export const filterQueryService=(query)=>{
    return new Promise((resolve,reject)=>{
        connection.query(query, (error, results) => {
            if(error){
                console.log("mm",error)
                reject(error)
            }
            resolve(results)
           
        });
    })
   
}