import Redis  from "ioredis";
import {} from 'dotenv/config'


const redisClient = () =>{
    try {
        if (process.env.UPSTASH_REDIS) {
          console.log("redis connected");
          return process.env.UPSTASH_REDIS;
        }
    } catch (error) {
        console.log("An error occured");
    }
}


const redis = new Redis(redisClient())

redis.on("error",(error)=>{
    console.log("an error occured",error);
})

//await redis.set("name","emmanuel")

export default redis