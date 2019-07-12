var express=require('express');
var app=express();
app.set("view engine","ejs");
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var info=[];
var update=[];
var del=[];
var read=[];
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var User=new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required: true,
        unique: false
    }
});
var model=mongoose.model('model',User);
mongoose.connect('mongodb://localhost/idb',{useCreateIndex:true,useNewUrlParser:true});


//DELETE RECORD
app.post('/deletion',(req,res)=>{
    model.findOneAndDelete({name:req.body.name},(err,result)=>{
        if(err) throw err;
        del.push(result.name+" "+"is deleted from database");
        read.pop(result);
        res.redirect('/delete')
    })
});
app.get('/delete',(req,res)=>{
    res.render('delete',{del:del})
});

//UPDATE RECORD
app.post('/updation',(req,res)=>{
    model.findOneAndUpdate({name:req.body.name},{ $set: { name: req.body.Name }},(err,result)=>{
        if(err) throw err;
        update.push(req.body.Name + ' is updated name of'+" "+req.body.name);
        read.push(result);
        read.pop(req.body.name);
        res.redirect('/update');
    })
});

app.get('/update',(req,res)=>{
    res.render('update',{update:update});
});


//CREATE OR ADD RECORDS
app.post("/add",(req,res)=>{
    const student=new model(req.body);
    student.save().then(()=>{
        info.push(student.name+" "+"is added to database");
        console.log("saved");
        res.redirect("/home");
    });
});
app.get('/home',(req,res)=>{
    res.render('app',{info:info});
});

//READ RECORDS
app.post('/all',(req,res)=>{
    model.find({}).then((result)=>{{
        read.push(JSON.stringify(result));
        res.redirect('/reading')
    }})
});
app.get('/reading',(req,res)=>{
    res.render('all',{read:read})
});



app.listen(4567,()=>{
    console.log("Server is running onto a port...");
});