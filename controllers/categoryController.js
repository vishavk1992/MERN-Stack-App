import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, resp) => {
  try {
    const { name } = req.body;
    if (!name) {
      return resp.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return resp.status(200).send({
        success: true,
        message: "Category Already Exist",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    resp.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};
