import mongoose from 'mongoose'
import colors from 'colors'

const connectDb = async () =>{
    try{
        const conn  = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected To Mongodb databse ${conn.connection.host}`.bgMagenta.white)

    }catch(error){
        console.log(`Error in Mongodb ${error}`.bgRed.white)
    }
}

export default connectDb