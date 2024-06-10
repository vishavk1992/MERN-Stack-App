import axios from "axios";
import { useState, useEffect } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  //get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      setCategories(data?.getCategory);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  return categories;
}
