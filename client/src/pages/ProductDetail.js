import { useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
      getSimilarProducts(
        data?.singleProduct._id,
        data?.singleProduct.category._id
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //get similar product
  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {/* {JSON.stringify(product, null, 4)} */}
      <div className="row container mt-4">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="350px"
            width="300px"
          />
        </div>
        <div className="col-md-6 ">
          <h1 className="text-center">Product Details</h1>
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Price : {product.price}</h6>
          <h6>Category : {product.category?.name}</h6>
          <button className="btn btn-secondary ms-1">Add to Cart</button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h6>Similar products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No similar Products Found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">
                  {p.description.substring(0, 30)} ...
                </p>
                <p className="card-text">${p.price}</p>

                <button className="btn btn-secondary ms-1">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
