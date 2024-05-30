import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId, //get from category id from moongoose
      ref: "category", //category model name is "category" that is refrence. bcoz we will connect product with category
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer, //data :buffer
      contentType: String,
    },
    shipping: {
      type: Boolean, //to show the order status
    },
  },
  { timestamps: true }
);

//timestamps for when order create then add

export default mongoose.model("products", productSchema);
