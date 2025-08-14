import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const generateToken = (res, user, message) => {

    //console.log("User is received from the database inside generateToken as:", user);

    const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY, {expiresIn:'1d'});
    return res.status(200).cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24*60*60*1000
    }).json({
        success:true,
        message,
        user
    })
}

export default generateToken