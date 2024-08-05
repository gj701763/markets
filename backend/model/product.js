import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String
  },
  caption: {
    type: String
  },
  imageUrls: {
    type: Array,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shopkeeper",
  },
  price: {
    type: Number,
    min: [1, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  category: { type: String},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;