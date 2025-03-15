import React from "react";
import css from "./FilterPopupWindow.module.css";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const FilterPopupWindow = ({
  isOpen = false,
  setIsOpen,
  handlePopupWindowFilter,
}) => {
  const sorts = [
    { id: "popularity", label: "Popularity", value: "popularity" },
    { id: "recommanded", label: "Recommanded", value: "recommanded" },

  ];
  const cuisines = [
    { id: "american", label: "American Classics", value: "american" },
    { id: "mexican", label: "Mexican/Latin American", value: "mexican" },

  ];
  const dietary = [
    { id: "vegan", label: "Vegan", value: "vegan" },
    { id: "halal", label: "Halal", value: "halal" },

  ];

  const rating = [
    { id: "rating4.5plus", label: "Rating 4.5+", value: "rating4.5plus" },
    { id: "rating4.0plus", label: "Rating 4.0+", value: "rating4.0plus" },
    { id: "rating3.5plus", label: "Rating 3.5+", value: "rating3.5plus" },
  ];

  const price = [
    { id: "lessThanX", label: "Less Than Rs.X", value: "lessThanX" },
    { id: "300-600", label: "Rs.300 to 600", value: "300-600" },
    { id: "moreThanX", label: "More Than Rs.X", value: "moreThanX" },
  ];

  const location = [
    { id: "Toronto", label: "Toronto", value: "Toronto" },
    { id: "Ottawa", label: "Ottawa", value: "Ottawa" },

  ];

  const costForTwo = [
    { id: "300-600", label: "Rs.300 to 600", value: "300-600" },
    { id: "400-700", label: "Rs.400 to 700", value: "400-700" },
    { id: "500-800", label: "Rs.500 to 800", value: "500-800" },
  ];

  const moreFilters = [
    {
      id: "wheelchairAccessible",
      label: "Wheelchair Accessible",
      value: "wheelchairAccessible",
    },
    { id: "creditCard", label: "Credit Card", value: "creditCard" },

  ];

  let [renderComp, setRenderComp] = useState(
    <RadioOptionBox
      option={sorts}
      handlePopupWindowFilter={handlePopupWindowFilter}
      enableTab='sort'
    />
  );
  let [enableTab, setEnableTab] = useState("sort");

  const handleClick = (selectedFilter) => {
    switch (selectedFilter) {
      case "sort":
        setEnableTab(selectedFilter);
        setRenderComp(
          <RadioOptionBox
            option={sorts}
            handlePopupWindowFilter={handlePopupWindowFilter}
            enableTab={selectedFilter}
          />
        );
        break;
      case "cuisines":
        setEnableTab(selectedFilter);
        setRenderComp(
          <CheckBoxOptionBox
            option={cuisines}
            handlePopupWindowFilter={handlePopupWindowFilter}
          />
        );
        break;
      case "price":
        setEnableTab(selectedFilter);
        setRenderComp(
          <CheckBoxOptionBox
            option={price}
            handlePopupWindowFilter={handlePopupWindowFilter}
          />
        );
        break;
      case "rating":
        setEnableTab(selectedFilter);
        setRenderComp(
          <RadioOptionBox
            option={rating}
            handlePopupWindowFilter={handlePopupWindowFilter}
            enableTab={selectedFilter}
          />
        );
        break;
      case "dietary":
        setEnableTab(selectedFilter);
        setRenderComp(
          <CheckBoxOptionBox
            option={dietary}
            handlePopupWindowFilter={handlePopupWindowFilter}
          />
        );
        break;
      case "costForTwo":
        setEnableTab(selectedFilter);
        setRenderComp(
          <CheckBoxOptionBox
            option={price}
            handlePopupWindowFilter={handlePopupWindowFilter}
          />
        );
        break;
      case "location":
        setEnableTab(selectedFilter);
        setRenderComp(
          <CheckBoxOptionBox
            option={location}
            handlePopupWindowFilter={handlePopupWindowFilter}
          />
        );
        break;
      case "moreFilters":
        setEnableTab(selectedFilter);
        setRenderComp(
          <CheckBoxOptionBox
            option={moreFilters}
            handlePopupWindowFilter={handlePopupWindowFilter}
          />
        );
        break;
      default:
        setEnableTab("sort");
        setRenderComp(
          <RadioOptionBox
            option={sorts}
            handlePopupWindowFilter={handlePopupWindowFilter}
            enableTab={selectedFilter}
          />
        );
    }
  };

  const filterTabs = [
    { label: "Sort", value: "sort" },
    { label: "Price Range", value: "price" },
    { label: "Cuisines", value: "cuisines" },
    { label: "Dietary", value: "dietary" },
    { label: "Cost For Two", value: "costForTwo" },
    { label: "Location", value: "location" },
    { label: "More Filters", value: "moreFilters" },
  ];

  return (
    <>
      {isOpen && (
        <div className={css.filterWindow}>
          <div className={css.filterBoxWrapper}>
            <div className={css.header}>
              <h2>Filter</h2>
              <MdClose
                onClick={() => setIsOpen((prev) => !prev)}
                className={css.closeBtn}
                aria-label="Close filter"
              />
            </div>
            <div className={css.container}>
              <ul className={css.sidebar}>
                {filterTabs.map((el, idx) => (
                  <li
                    key={idx}
                    className={`${css.tab} ${enableTab === el.value && css.active
                      }`}
                  >
                    <button
                      className={css.option}
                      onClick={() => handleClick(el.value)}
                      aria-label={`Filter by ${el.label}`}
                    >
                      {el.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={css.main}>{renderComp}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RadioOptionBox = ({ option, handlePopupWindowFilter, enableTab }) => {
  return (
    <>
      <form className={css.radioOptions}>
        <p>Sort By</p>
        {option.map((el, idx) => (
          <div className={css.sortChose} key={idx}>
            <input
              type="radio"
              id={el.id}
              name={enableTab}
              value={el.value}
              onChange={(evt) => handlePopupWindowFilter(evt)}
            />
            <label htmlFor={el.id}>{el.label}</label>
          </div>
        ))}
      </form>
    </>
  );
};

const CheckBoxOptionBox = ({ option, handlePopupWindowFilter }) => {
  return (
    <>
      <form className={css.checkBoxOptions}>
        <p>Filter By</p>
        {option.map((el, idx) => (
          <div className={css.cuisineChose} key={idx}>
            <input
              type="checkbox"
              id={el.id}
              name={el.id}
              value={el.value}
              onChange={(evt) => handlePopupWindowFilter(evt)}
            />
            <label htmlFor={el.id}>{el.label}</label>
          </div>
        ))}
      </form>
    </>
  );
};

export default FilterPopupWindow;
