const {User} = require("../model/user.model");

exports.getUsers =async(req,res,next)=>{
    try{
        const users =await User.find();
        res.status(200).json({
            status:"success",
            results:users.length,
            data:{users}
        })
    }catch(err){
        res.status(500).json({
            status:"fail",
            message:err
        });;
    }
}

