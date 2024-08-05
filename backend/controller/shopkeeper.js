import User from "../model/auth.js";
import Product from "../model/product.js";
import Shopkeeper from "../model/shopkeeper.js";

export const createShopkeeper = async (req, res, next) => {
  try {
    const {
      userId,
      shopName,
      shopAddress,
      shopDescription,
      contactNumber
    } = req.body;

    const validUser = await User.findById(userId);
    if (!validUser) {
      const error = {
        statusCode : 400,
        message: 'User not found'
      }
      return next(error);
    }

    if(validUser.role !== "shopkeeper") {
      const error = {
        statusCode : 400,
        message: 'Your role is not shopkeeper'
      }
      return next(error);
    }

    const checkShopkeeper = await Shopkeeper.findOne({userId : userId});
    if (checkShopkeeper) {
      const error = {
        statusCode : 400,
        message: 'Shopkeeper already created'
      }
      return next(error);
      }

    const shopkeeper = new Shopkeeper({
      userId,
      shopName,
      shopAddress,
      shopDescription,
      contactNumber
    });

    await shopkeeper.save();

    res.status(201).json({ message: 'Shopkeeper created successfully' });
  } catch (error) {
    if(error.message === "Shopkeeper validation failed: contactNumber.0: Invalid contact number. Please enter a 10-digit phone number."){
      const error = {
        statusCode : 400,
        message: 'Invalid contact number.'
      }
      return next(error);
    }
    next(error);
  }
};

export const updateShopkeeper = async (req, res, next) => {
  try {
    const {
      shopkeeperId,
      shopName,
      shopAddress,
      shopDescription,
      contactNumber,
      product
    } = req.body;

    const validShopkeeper = await Shopkeeper.findById(shopkeeperId);
    if (!validShopkeeper) {
      const error = {
        statusCode: 400,
        message: 'Shopkeeper not found'
      }
      return next(error);
    }

    const validProduct = await Product.findById(product)
    if(!validProduct) {
      const error = {
        statusCode: 400,
        message: 'Product not found'
      }
      return next(error);
    }


    if((validProduct.owner).toString() !== (validShopkeeper._id).toString()) {
      const error = {
        statusCode: 400,
        message: 'You are not product owner'
      }
      return next(error);
    }

    console.log((validShopkeeper.products).toString())
    console.log((product).toString())

    // Check if product already exists in shopkeeper's products
    if (((validShopkeeper.products).toString()).includes((product).toString())) {
      const error = {
        statusCode: 400,
        message: 'Product already added to shopkeeper'
      }
      return next(error);
    }

    // Update shopkeeper details
    validShopkeeper.shopName = shopName || validShopkeeper.shopName;
    validShopkeeper.shopAddress = shopAddress || validShopkeeper.shopAddress;
    validShopkeeper.shopDescription = shopDescription || validShopkeeper.shopDescription;
    validShopkeeper.contactNumber = contactNumber || validShopkeeper.contactNumber;

    // Add products to shopkeeper
    if (product) {
      validShopkeeper.products = validShopkeeper.products.concat(product);
    }

    await validShopkeeper.save();

    res.status(200).json({ message: 'Shopkeeper updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getShopkeeper = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const shopkeeper = await Shopkeeper.findOne({ userId: id }).populate("products" , "imageUrls");
    if (!shopkeeper) {
      return res.status(404).json({ message: "Shopkeeper not found" });
    }

    res.status(200).json(shopkeeper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving shopkeeper" });
}
};