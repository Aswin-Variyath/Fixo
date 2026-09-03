import {createClient} from "redis"
import { ENV } from "./env.config"

export const redisClient = createClient({
    url:ENV.REDIS.URL
})

redisClient.on("error",(error)=>{
    console.error("Redis client error",error)
})