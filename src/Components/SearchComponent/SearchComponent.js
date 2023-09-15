import React, { useEffect, useState } from "react";
import ProductImage from "../ProductImage/ProductImage";
import "./SearchComponent.css";
import SearchPage from "../SearchPage/SearchPage";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showSearchPage, setShowSearchPage] = useState(false);

  useEffect(() => {
    fetch("https://search.nosto.com/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query:
          "query ( $accountId: String, $query: String, $segments: [String!], $rules: [String!], $products: InputSearchProducts, $keywords: InputSearchKeywords, $sessionParams: InputSearchQuery ) { search( accountId: $accountId query: $query segments: $segments rules: $rules products: $products keywords: $keywords sessionParams: $sessionParams ) { query redirect products { hits { productId url name imageUrl thumbUrl description brand variantId availability price priceText categoryIds categories customFields { key value } priceCurrencyCode datePublished listPrice unitPricingBaseMeasure unitPricingUnit unitPricingMeasure googleCategory gtin ageGroup gender condition alternateImageUrls ratingValue reviewCount inventoryLevel skus { id name price listPrice priceText url imageUrl inventoryLevel customFields { key value } availability } pid onDiscount extra { key value } saleable available tags1 tags2 tags3 } total size from collapse fuzzy categoryId categoryPath } } }",
        variables: {
          accountId: "shopify-53103526077",
          query: query ? query : "dr",
          products: {
            size: 16 // TODO: Research how to return all results for infinity scroll on next page
          },
          sessionParams: {
            segments: [
              "613aa0000000000000000002",
              "613aa0000000000000000004",
              "61c26a800000000000000002",
              "5b71f1500000000000000006"
            ],
            products: {
              personalizationBoost: []
            }
          }
        }
      })
    })
      .then((res) => res.json())
      .then((response) => {
        setProducts(response.data.search.products.hits);
      });
  }, [query]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setShowSearchPage(true);
    }
  };

  return (
    <>
      {showSearchPage ? (
        <SearchPage
          products={products}
          goback={() => setShowSearchPage(false)}
        />
      ) : (
        <div className="search-container">
          <div className="site-header__search-input-wrapper">
            <input
              className="site-header__search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <hr />
          <div>
            <p className="products-header">Trending Searches</p>
            <div className="search-tags">
              <a href="/">homecomming dress</a>
              <a href="/">white dress</a>
            </div>
          </div>
          <hr />
          <div>
            <p className="products-header">Collections</p>
            <div className="search-tags">
              <a href="/">Dress</a>
              <a href="/">Women's Top</a>
            </div>
          </div>
          <p className="products-header">Products</p>
          <div className="swatch-container">
            {(() => {
              let productCards = [];
              for (let i = 0; i < Math.min(products.length, 4); i++) {
                let product = products[i];
                productCards.push(
                  <div className="product-card" key={product.productId}>
                    <ProductImage src={product.imageUrl} alt={product.name} />
                    <div className="card-details">
                      <p className="product-title">{product.name}</p>
                      <p className="product-price">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              }
              return productCards;
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchComponent;

//  {/* <div className="product-card" key={product.productId} onClick={() => Tapcart.actions.openProduct({ productId: product.productId, isRelatedProduct: false })}>
//         <img className="product-image" src={product.imageUrl} alt={product.name} />
//         <h4 className="product-title">{product.name}</h4>
//         <p className="product-price">${product.price}</p>
//       </div> */}
