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

//update category controller
export const updateCategoryController = async (req, resp) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    resp.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      mesaage: " Error while updating category ",
    });
  }
};

//get all category
export const getCategoryController = async (req, resp) => {
  try {
    const getCategory = await categoryModel.find({});
    resp.status(200).send({
      success: true,
      message: "All Categories List",
      getCategory,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "error while getting all category",
    });
  }
};

//singleCategoryController

export const singleCategoryController = async (req, resp) => {
  try {
    const { slug } = req.params;
    const singleCategory = await categoryModel.findOne({
      slug: req.params.slug,
    });
    resp.status(200).send({
      success: true,
      message: "Get single Category",
      singleCategory,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "error while getting single category",
    });
  }
};

// /deleteCategoryController

export const deleteCategoryController = async (req, resp) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    resp.status(200).send({
      success: true,
      message: "Category deleted succesffully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      error,
      message: "Error while delete category",
    });
  }
};
