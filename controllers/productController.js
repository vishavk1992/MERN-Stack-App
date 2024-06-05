import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";

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
