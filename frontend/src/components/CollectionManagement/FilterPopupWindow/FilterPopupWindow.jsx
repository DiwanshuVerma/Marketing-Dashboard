import React, { useState } from "react";
import css from "./FilterPopupWindow.module.css";
import { MdClose } from "react-icons/md";


const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];


const displayRating = (val) => {
  if (val === 0) return "Any";
  return val.toFixed(1);
};


const displayCost = (val) => {
  if (val >= 2000) return "₹0 - Any";
  return `₹0 - ₹${val}`;
};

const FilterPopupWindow = ({
  isOpen, setIsOpen, onApplyFilters }) => {

  const sorts = [
    { id: "popularity", label: "Popularity", value: "popularity" },
    { id: "ratingHighToLow", label: "Rating: High to Low", value: "ratingHighToLow" },
    { id: "costLowToHigh", label: "Cost: Low to High", value: "costLowToHigh" },
    { id: "costHighToLow", label: "Cost: High to Low", value: "costHighToLow" },
    { id: "deliveryTime", label: "Distance", value: "deliveryTime" },
  ];


  const allLocations = [
    { id: "newYork", label: "New York", value: "newYork" },
    { id: "mexico", label: "Mexico", value: "mexico" },
    { id: "toronto", label: "Toronto", value: "toronto" },
    { id: "montreal", label: "Montreal", value: "montreal" },
    { id: "phoenix", label: "Phoenix", value: "phoenix" },
  ];

  // Sample cuisines
  const allCuisines = [
    { id: "american", label: "American", value: "american" },
    { id: "mexican", label: "Mexican", value: "mexican" },
    { id: "italian", label: "Italian", value: "italian" },
    { id: "chinese", label: "Chinese", value: "chinese" },
    { id: "japanese", label: "Japanese", value: "japanese" },
    { id: "thai", label: "Thai", value: "thai" },
    { id: "korean", label: "Korean", value: "korean" },
    { id: "vietnamese", label: "Vietnamese", value: "vietnamese" },
    { id: "indian", label: "Indian", value: "indian" },
    { id: "mediterranean", label: "Mediterranean", value: "mediterranean" },
    { id: "seafood", label: "Seafood", value: "seafood" },
    { id: "fusion", label: "Global Fusion", value: "fusion" },
    { id: "desserts", label: "Desserts & Snacks", value: "desserts" },
    { id: "chains", label: "Popular Chains", value: "chains" },
  ];


  const [cuisineSearch, setCuisineSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // Filtered cuisines based on search input
  const filteredCuisines = allCuisines.filter((c) =>
    c.label.toLowerCase().includes(cuisineSearch.toLowerCase())
  );
  // Filtered locations based on search input
  const filteredLocations = allLocations.filter((c) =>
    c.label.toLowerCase().includes(locationSearch.toLowerCase())
  );


  const moreFilters = [
    { id: "wheelchairAccessible", label: "Wheelchair Accessible", value: "wheelchairAccessible" },
    { id: "creditCard", label: "Credit Card", value: "creditCard" },
    { id: "buffet", label: "Buffet", value: "buffet" },
    { id: "happyHours", label: "Happy Hours", value: "happyHours" },
    { id: "servesAlcohol", label: "Serves Alcohol", value: "servesAlcohol" },
    { id: "sundayBrunch", label: "Sunday Brunch", value: "sundayBrunch" },
    { id: "dessertsAndBakes", label: "Desserts and Bakes", value: "dessertsAndBakes" },
    { id: "luxuryDining", label: "Luxury Dining", value: "luxuryDining" },
    { id: "cafes", label: "Cafés", value: "cafes" },
    { id: "fineDining", label: "Fine Dining", value: "fineDining" },
    { id: "wifi", label: "Wifi", value: "wifi" },
    { id: "outdoorSeating", label: "Outdoor Seating", value: "outdoorSeating" },
    { id: "onlineBookings", label: "Online Bookings", value: "onlineBookings" },
    { id: "hygieneRated", label: "Hygiene Rated", value: "hygieneRated" },
    { id: "openNow", label: "Open Now", value: "openNow" },
    { id: "pubsAndBars", label: "Pubs & Bars", value: "pubsAndBars" },
  ];


  const filterTabs = [
    { label: "Sort by", value: "sort" },
    { label: "Cuisines", value: "cuisines" },
    { label: "Rating", value: "rating" },
    { label: "Cost for two", value: "costForTwo" },
    { label: "Location", value: "location" },
    { label: "More filters", value: "moreFilters" },
  ];


  const [filters, setFilters] = useState({
    sort: "",
    cuisines: [],
    rating: 0,
    cost: 2000,
    moreFilters: [],
    locations: [],
    onlyPopular: false,
  });

  // Active tab
  const [activeTab, setActiveTab] = useState("sort");

  // Handle rating slider
  const handleRatingChange = (e) => {
    const stepIndex = parseInt(e.target.value, 10);
    setFilters((prev) => ({
      ...prev,
      rating: ratingSteps[stepIndex],
    }));
  };
  const ratingSliderValue = ratingSteps.indexOf(filters.rating);

  // Handle cost slider
  const handleCostChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setFilters((prev) => ({
      ...prev,
      cost: val,
    }));
  };

  // Sort radio
  const handleSortChange = (evt) => {
    const value = evt.target.value;
    setFilters((prev) => ({
      ...prev,
      sort: value,
      onlyPopular: value === "popularity",
    }));
  };

  // Cuisine checkboxes
  const handleCuisineChange = (evt) => {
    const { value, checked } = evt.target;
    setFilters((prev) => {
      const arr = prev.cuisines || [];
      if (checked) {
        return { ...prev, cuisines: [...arr, value] };
      } else {
        return { ...prev, cuisines: arr.filter((val) => val !== value) };
      }
    });
  };
  // location checkboxes
  const handleLocationChange = (evt) => {
    const { value, checked } = evt.target;
    setFilters((prev) => {
      const arr = prev.locations || [];
      if (checked) {
        return { ...prev, locations: [...arr, value] };
      } else {
        return { ...prev, locations: arr.filter((val) => val !== value) };
      }
    });
  };


  const handleMoreFiltersChange = (evt) => {
    const { value, checked } = evt.target;
    setFilters((prev) => {
      const arr = prev.moreFilters || [];
      if (checked) {
        return { ...prev, moreFilters: [...arr, value] };
      } else {
        return { ...prev, moreFilters: arr.filter((val) => val !== value) };
      }
    });
  };


  const handleClearAll = () => {
    setFilters({
      sort: "",
      cuisines: [],
      rating: 0,
      cost: 2000,
      moreFilters: [],
      locations: [],
      onlyPopular: false,
    });
    setCuisineSearch("");
  };


  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    setIsOpen(false);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "sort":
        return (
          <div className={css.optionsContainer}>
            {sorts.map((item) => (
              <label key={item.id} className={css.option}>
                <input
                  type="radio"
                  name="sort"
                  value={item.value}
                  checked={filters.sort === item.value}
                  onChange={handleSortChange}
                />
                {item.label}
              </label>
            ))}
          </div>
        );
      case "cuisines":
        return (
          <div className={css.optionsContainer}>
            <input
              type="text"
              placeholder="Search here"
              className={css.searchBar}
              value={cuisineSearch}
              onChange={(e) => setCuisineSearch(e.target.value)}
            />
            <div className={css.cuisineList}>
              {filteredCuisines.map((c) => (
                <label key={c.id} className={css.option}>
                  <input
                    type="checkbox"
                    value={c.value}
                    checked={filters.cuisines.includes(c.value)}
                    onChange={handleCuisineChange}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
        );
      case "rating":
        return (
          <div className={css.sliderContainer}>
            <div className={css.sliderLabel}>
              Rating: {displayRating(filters.rating)}
            </div>
            <input
              type="range"
              min="0"
              max={ratingSteps.length - 1}
              step="1"
              value={ratingSliderValue}
              onChange={handleRatingChange}
            />
            <div className={css.sliderMarks}>
              {ratingSteps.map((val, idx) => (
                <span key={idx}>{displayRating(val)}</span>
              ))}
            </div>
          </div>
        );
      case "costForTwo":
        return (
          <div className={css.sliderContainer}>
            <div className={css.sliderLabel}>
              Cost for two: {displayCost(filters.cost)}
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={filters.cost}
              onChange={handleCostChange}
            />
            <div className={css.sliderMarks}>
              <span>₹0</span>
              <span>Any</span>
            </div>
          </div>
        );

      case "location":
        return (
          <div className={css.optionsContainer}>
            <input
              type="text"
              placeholder="Search here"
              className={css.searchBar}
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
            <div className={css.cuisineList}>
              {filteredLocations.map((c) => (
                <label key={c.id} className={css.option}>
                  <input
                    type="checkbox"
                    value={c.value}
                    checked={filters.locations.includes(c.value)}
                    onChange={handleLocationChange}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
        );

      case "moreFilters":
        return (
          <div className={css.optionsContainer}>
            {moreFilters.map((m) => (
              <label key={m.id} className={css.option}>
                <input
                  type="checkbox"
                  value={m.value}
                  checked={filters.moreFilters.includes(m.value)}
                  onChange={handleMoreFiltersChange}
                />
                {m.label}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div className={css.filterWindow}>
          <div className={css.filterBoxWrapper}>
            {/* Header */}
            <div className={css.header}>
              <h2>Filters</h2>
              <MdClose onClick={() => setIsOpen(false)} className={css.closeBtn} />
            </div>

            <div className={css.container}>
              {/* Sidebar tabs */}
              <ul className={css.sidebar}>
                {filterTabs.map((tab) => (
                  <li
                    key={tab.value}
                    className={`${css.tab} ${activeTab === tab.value ? css.active : ""}`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>

              {/* Main content area */}
              <div className={css.main}>{renderTabContent()}</div>
            </div>

            {/* Footer with buttons */}
            <div className={css.footer}>
              <button className={css.clearBtn} onClick={handleClearAll}>
                Clear all
              </button>
              <button className={css.applyBtn} onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPopupWindow;
