const User = require('../models/user');
const bcrypt = require('bcrypt');

function isstringinvalid(string) {
    if(string == undefined || string.length=== 0){
        return true;
    }else {
        return false;
    }
}

exports.signUp = async (req,res,next) => {
    try{
        const { name, email , password } = req.body;
        console.log('email',email,password)
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad params . something is missing"})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err,hash) => {
        await User.create( { name:name,email:email,password:hash})
           res.status(201).json({message: 'Succesfully done'})
           })
    } catch(err) {
        res.status(500).json(err);

    }
}

exports.login = async (req,res) => {
    try {
        const { email,password } = req.body ;
        console.log(email);
        if( isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad params . something is missing"})
        }
      
        const user = await User.findAll({where : { email }})
        if(user.length > 0) {
            bcrypt.compare(password,user[0].password, (err,result) => {
                if(err){
                    throw new Error('something went wrong')
                }
                if(result === true){
                    res.status(200).json({ success: true, message: "User Logged in Successfully"})
                } else {
                    return res.status(401).json({ success:false, message: "Password is incorrect"})
                }
            })
        } else {
            return res.status(404).json({success: false, message:"User doesn't exist"})
        }
    } catch(err) {
        
        res.status(500).json({message:err , success:false})

    }
}