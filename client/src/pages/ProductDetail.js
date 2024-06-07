import { useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState([]);
  //get single Product

  //   const getProduct = async () => {
  //     try {
  //       const response = await axios.get(`/api/v1/product/single-product/${params.slug}`);
  //       setProduct(response.data?.singleProduct);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };    //we can also write like this without destructuring {data}

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/single-product/${params.slug}`
      );
      setProduct(data?.singleProduct);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  return (
    <Layout>
      {/* {JSON.stringify(product, null, 4)} */}
      <div className="row container mt-4">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300px"
            width="350px"
          />
        </div>
        <div className="col-md-6 ">
          <h1 className="text-center">Product Details</h1>
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Price : {product.price}</h6>
          <h6>Category : {product.category.name}</h6>
          <button className="btn btn-secondary ms-1">Add to Cart</button>
        </div>
      </div>
      <div className="row">Similar Products</div>
    </Layout>
  );
};

export default ProductDetail;
