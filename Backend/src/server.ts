import express from "express"

const app  = express()
app.get("/",(req,res)=>{
    console.log("Hjit")
    res.send("Hello")
})
app.listen(3001,()=>{
    console.log("Server is running.....")
})