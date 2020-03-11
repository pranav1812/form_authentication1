const express=require('express');
const app=express();
var bodyParser=require('body-parser');
const mongoose=require('mongoose');
//const schema=require('./index');

mongoose.connect('mongodb://localhost/playground',{useNewUrlParser:true,  useUnifiedTopology: true})
    .then(()=>console.log('connected'))

const courseSchema=mongoose.Schema({
    email: String,
    password: String,
    username:String,
    dob:String
});




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/form.html");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const Course=mongoose.model('Course',courseSchema);
app.post('/form',(req,res)=>{
    res.send(req.body);
    const myData=new Course(req.body);
    myData.save()
        .then(item=> {
            console.log(item);
            Course.find()
                .then((courses=> console.log(courses)))
        })
        .catch(err=>{
            res.status(400).send("unable to save to database");
        })


})


app.listen(3000)