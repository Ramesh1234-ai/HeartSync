import mongoose from 'mongoose'
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexusai'
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB Connected:', mongoURI)
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message)
    process.exit(1)
  }
}
export default connectDB
