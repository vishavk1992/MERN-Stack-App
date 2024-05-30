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
