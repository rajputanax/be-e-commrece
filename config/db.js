import mongoose from "mongoose";
 const connection = async () => {
  try {
    const wire = await mongoose.connect(process.env.MONGO_DB_URI);
    if (wire) {
      console.log(`✅ successfull connection established ${wire.connection.host}`);
      return wire;
    }
  } catch (error) {
    console.error("❌ mongoDb coonection error", error);
    process.exit(1);
  }
};
export default connection;



//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................