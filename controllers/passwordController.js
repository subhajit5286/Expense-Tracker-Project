const User = require('../models/user')
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()

const forgotPassword = async (req,res) =>{
    const  {email}  = req.body;
        try {
            const user = await User.findOne({ where: { email} });
            console.log(process.env.API_KEY)
        if (user) {
            const client = Sib.ApiClient.instance ;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = {
                email: 'subhajit.bhattacharyya@gmail.com'
            }
            const receivers = [
                {
                email
            },
        ]
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:'Reset your ExpenseTracker Password',
            textContent:'You are receiving this email because you (or someone else) have requested the reset of the password for your account.',
            htmlContent: `
                <p>Hello,</p>
                <p>We received a request to reset the password for your account. Please follow the link below to reset your password:</p>
                <p>Reset Password</p>
                <p>If you did not request this password reset, please ignore this email and contact us immediately.
                </p><p>Thank you,
                </p><p>Expensify</p>
                `
        })
            return res.status(200).json({ message:  'Link to reset password sent to your mail ', success: true })
        }
        else{
        return res.status(202).json({ message: 'User not Exists..Please Signup or enter correct email id.' }); 
     }  
           
    }
        catch(err){
            console.log(err)
        return res.json({ message: "Reset link not send", sucess: false });
    }
}



module.exports = {
    forgotPassword
}