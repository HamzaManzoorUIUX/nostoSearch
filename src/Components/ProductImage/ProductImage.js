import React from "react";

const ProductImage = ({ src, alt }) => {
  return (
    <img
      className="product-image"
      src={src}
      alt={alt}
      style={{
        height: "70px",
        width: "auto"
      }}
    />
  );
};

export default ProductImage;
