const express=require('express');
const app=express();
var bodyParser=require('body-parser');
const mongoose=require('mongoose');
const sessions=require('client-sessions');
const bcrypt=require('bcryptjs')

app.use(sessions({
    cookieName: "session",
    secret:'wtftopsecretbsdk',
    duration: 5*60*1000
}))

mongoose.connect('mongodb://localhost/playground',{useNewUrlParser:true,  useUnifiedTopology: true})
    .then(()=>console.log('connected'))

const courseSchema=mongoose.Schema({
    email: {type:String, required:true, unique: true},
    password: String,
    username:String,
    dob:String
});




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/form.html");
});

app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/login.html")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const Course=mongoose.model('Course',courseSchema);
app.post('/form',(req,res)=>{
    //res.send(req.body);
    var hash=bcrypt.hashSync(req.body.password,14);
    req.body.password=hash;

    const myData=new Course(req.body);
    myData.save()
        .then(item=> {
            console.log(item);

        })
        .catch(err=>{
            res.status(400).send("unable to save to database");
        })


})

app.post('/login',(req,res)=>{
    //res.send(req.body);
    Course.findOne({ email:req.body.email},(err,course)=>{
        if(err|| !course || !bcrypt.compareSync(req.body.password, course.password)){
            console.log('wrong username / password');
            res.sendFile(__dirname+'/login.html')
        }
        else{
            req.session.uID=course._id;
            res.sendFile(__dirname+'/dashboard.html')
        }
    })

})

app.get('/dashboard',(req,res)=>{
    if(!(req.session && req.session.uID)){
        res.sendFile(__dirname+'/login.html')
    }
    else{
        Course.findById(req.session.uID,(err,user)=>{
            if(err) console.log(err)
            if(!user) res.sendFile(__dirname+'/login.html')
            else
                res.sendFile(__dirname+'/dashboard.html')
        })
    }
})

app.listen(3000)
// csurf remaining