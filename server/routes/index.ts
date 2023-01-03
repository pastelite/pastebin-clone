import { Router} from "express";

const router = Router();

let count = 0

router.get('/',function(req,res,next){
  res.json({
    message: "Hello world!"
  })
})

router.get('/count',(req,res,next)=>{
  res.status(200).json({
    count
  })
})

router.post('/count',(req,res,next)=>{
  count += req.body.count
  console.log(count)
  res.status(200).json({
    count
  })
})

export default router;