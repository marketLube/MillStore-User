import React from "react";
import { useCategories } from "../../../hooks/queries/categories";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setCategory } from "../../../redux/features/category/categorySlice";
import { useNavigate } from "react-router-dom";
// const categories = [
//   { name: "Power & Hand Tools", imgSrc: "path/to/power-tools.png" },
//   { name: "Gardening Tools", imgSrc: "path/to/gardening-tools.png" },
//   { name: "Home Care", imgSrc: "path/to/home-care.png" },
//   { name: "Home Improvement", imgSrc: "path/to/home-improvement.png" },
//   { name: "Kitchen & Dining", imgSrc: "path/to/kitchen-dining.png" },
//   { name: "Car Care", imgSrc: "path/to/car-care.png" },
//   { name: "Stationery", imgSrc: "path/to/stationery.png" },
// ];

function Category() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading } = useCategories();

  const categories = data?.envelop?.data || [];

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category?._id));
    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  return (
    <div className="container">
      <h1>
        <span> Shop By </span>Category
      </h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="categories">
          {categories?.map((category, index) => (
            <div
              className="category"
              key={index}
              onClick={() => {
                handleCategoryClick(category);
              }}
            >
              <div className="image-container">
                <img src={category.image} alt={category.name} />
              </div>
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Category;
