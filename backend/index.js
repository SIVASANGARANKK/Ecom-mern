const port = 4000
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const cors  = require("cors")
const { log } = require("console")
const { AsyncLocalStorage } = require("async_hooks")
const { channel } = require("diagnostics_channel")

//mongopass 

app.use(express.json());
app.use(cors())

// mongoose.connect("mongodb+srv://sgskk4400:<password>@cluster0.jgwfbxy.mongodb.net/e-commerce")

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//Image
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb) =>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Upload endpoint
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res) =>{
    res.json({
        success : 1,
        image_url :`http://localhost:${port}/images/${req.file.filename}`
    })
})

// schema
const Product = mongoose.model("Product",{
    id : {
        type : Number,
        required : true,
    },
    name :{
        type : String,
        required : true,
    },
    image : {
        type : String ,
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    new_price: {
        type : Number,
        required : true
    },
    old_price: {
        type : Number,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
    },
    available :{
        type : Boolean,
        default : true,
    },
})


app.post('/addproduct' ,async(req,res) =>{
    let products = await Product.find({})
    let id
    if(products.length > 0 ){
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0]
        id = last_product.id+1
    }
    else{
        id = 1
    }
        const product = new Product({
        id: id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product)
    await product.save();
    console.log("saved")
    res.json({
        success : true,
        name : req.body.name,
    })
})

//create api for delete

app.post('/removeproduct',async (req,res) =>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Removed")
    res.json({
        success : "true",
        name : req.body.name
    })
})

app.get('/allproducts' , async (req,res) =>{
    let products = await Product.find({})
    console.log("All products Fetched")
    res.send(products)
})

const Users = mongoose.model('Users',{
    name : {
        type : String,
    },
    email : {
        type:String,
        unique : true,
    },
    password :{
        type: String,
    },
    cartData : {
        type : Object,
    },
    date :{
        type : Date,
        default : Date.now,
    }
})

// user endpoint reg

app.post('/signup',async(req,res) =>{
    let check = await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,errors:"existing user found"})
    }
    let  cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name : req.body.username,
        email : req.body.email,
        password : req.body.password,
        cartData : cart,
    })
    await user.save();
    const data = {
        user :{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom')
    res.json({
        success : true , token
    })
})

app.post('/login',async (req,res) =>{
    let user = await Users.findOne({email:req.body.email})
    if (user){
        const passcompare = req.body.password === user.password
        if(passcompare){
            const data = {
                user : {
                    id : user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({
                success:true , token
            })
        }
        else{
            res.json({
                success : false ,errors : "Wrong password"
            })
        }
    }
        else{
            res.json({
                success : false ,errors : "Wrong email id"
            })
    }
})

//new collection data
app.get('/newcollection',async (req,res) => {
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8)
    console.log("Newcollection fetched")
    res.send(newcollection)
})

app.get('/popularinkids',async (req,res) =>{
    let products = await Product.find({category:"kid"})
    let popular_in_kids = products.slice(0,4)
    res.send(popular_in_kids)
})

//middleware to fetch user
const fetchUser = async (req,res,next) =>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({errors:"Please authenticat using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token, 'secret_ecom')
            req.user = data.user
            next()
        }
        catch(error){
            res.status(401).send({errors:"please authenticate using valid token"})
        }
    }
} 



//adding product in cartdata

app.post('/addtocart',fetchUser,async(req,res) =>{
    console.log(req.body,req.user)
    let userData = await Users.findOne({_id:req.user.id})
    userData.cartData[req.body.itemId] += 1
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})


app.post('/removefromcart',fetchUser,async(req,res) =>{
    let userData = await Users.findOne({_id:req.user.id})
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("removed")
})
//remove product in cartdata

app.post('/getcart',fetchUser,async (req,res) =>{
    console.log("Get cart")
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData)
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port" + port)
    }
    else{
        console.log("Error" +error)
    }
})







