import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

export const createProductController = async (req, resp) => {
  try {
    const { name, slug, description, category, price, shipping, quantity } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return resp.status(500).send({ error: "Name is required" });
      case !description:
        return resp.status(500).send({ error: "Description is required" });
      case !category:
        return resp.status(500).send({ error: "Category is required" });
      case !price:
        return resp.status(500).send({ error: "price is required" });
      case !quantity:
        return resp.status(500).send({ error: "Quantity is required" });
      case !photo && photo.size > 1000000:
        return resp
          .status(500)
          .send({ error: "photo is required and should be less than 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    resp.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error while creating product",
    });
  }
};

//get All ProductController
export const getProductController = async (req, resp) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    resp.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in getting products",
      // error,
      error: error.message, //we can also write like this
    });
  }
};

//getSingleProductController

export const getSingleProductController = async (req, resp) => {
  try {
    const singleProduct = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    resp.status(200).send({
      success: true,
      message: "single product fetched",
      singleProduct,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

//get photo
export const productPhotoController = async (req, resp) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      resp.set("Content-type", product.photo.contentType);
      return resp.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "error while getting photo",
      error,
    });
  }
};

// delete product
export const productDeleteController = async (req, resp) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    resp.status(200).send({
      message: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "error while deleting photo",
      error,
    });
  }
};

///UPDATE product
export const updateProductController = async (req, resp) => {
  try {
    const { name, slug, description, category, price, shipping, quantity } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return resp.status(500).send({ error: "Name is required" });
      case !description:
        return resp.status(500).send({ error: "Description is required" });
      case !category:
        return resp.status(500).send({ error: "Category is required" });
      case !price:
        return resp.status(500).send({ error: "price is required" });
      case !quantity:
        return resp.status(500).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return resp
          .status(500)
          .send({ error: "photo is required and should be less than 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    resp.status(201).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};

//productFilterController

export const productFilterController = async (req, resp) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error while filter product",
    });
  }
};

//productCountController
export const productCountController = async (req, resp) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    resp.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error in product count",
    });
  }
};

//productListController
export const productListController = async (req, resp) => {
  try {
    const perPage = 9;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error in product count",
    });
  }
};

// /searchProductController
export const searchProductController = async (req, resp) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    resp.json(results);
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error in serach product API",
    });
  }
};

//relatedProductController
export const relatedProductController = async (req, resp) => {
  try {
    const { pid, cid } = req.params;
    console.log("PID:", pid, "CID:", cid); // Add this line to log parameters
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error in related product API",
    });
  }
};

//productCategoryController
export const productCategoryController = async (req, resp) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    resp.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "error while getting category wise product",
    });
  }
};

//braintreeTokenController  //token
export const braintreeTokenController = async (req, resp) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        resp.status(500).send(err);
      } else {
        resp.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//brainTreePaymentController

export const brainTreePaymentController = async (req, resp) => {
  try {
    const { cart, nonce } = req.body; //nonce from braintree
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          resp.json({ ok: true });
        } else {
          resp.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
