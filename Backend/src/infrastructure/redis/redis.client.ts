import {createClient} from "redis"
import { ENV } from "../../config/env.config"
export const redisClient = createClient({
    url:ENV.REDIS_URL
})

redisClient.on("error",(error)=>{
    console.error("Redis client error",error)
})