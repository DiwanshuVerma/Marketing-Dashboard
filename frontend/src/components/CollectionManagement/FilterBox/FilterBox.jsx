// FilterBox.jsx
import css from "./FilterBox.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";
import { useState } from "react";

const dietary = [
  { id: "vegan", label: "Vegan", value: "vegan" },
  { id: "halal", label: "Halal", value: "halal" },
  { id: "glutenFree", label: "Gluten-Free", value: "glutenFree" },
  { id: "vegetarian", label: "Vegetarian", value: "vegetarian" },
  { id: "dairyFree", label: "Dairy-Free", value: "dairyFree" },
  { id: "nutFree", label: "Nut-Free", value: "nutFree" },
];     

const sorts = [
  { id: "popularity", label: "Popularity", value: "popularity" },
  { id: "rating", label: "Rating", value: "rating" },
  { id: "lowToHigh", label: "Cost: Low to High", value: "lowToHigh" },
  { id: "highToLow", label: "Cost: High to Low", value: "highToLow" },
  { id: "distance", label: "Distance", value: "distance" },
];

const cuisines = [
  { id: "american", label: "American Classics", value: "american" },
  { id: "mexican", label: "Mexican", value: "mexican" },
  { id: "italian", label: "Italian", value: "italian" },
  { id: "chinese", label: "Chinese", value: "chinese" },
  { id: "indian", label: "Indian", value: "indian" },
];

const FilterBox = (props) => {
  const {
    leftIcon,
    rightIcon,
    text,
    filterGroup,
    handleFilter,
    setIsOpen,
    handlePopupWindowFilter,
  } = props;
  const [isDropdown, setIsDropdown] = useState(false);

  const [arr1, arr2] = filterGroup;
  const dropdownFilter = ["Cuisines", "Dietary", "Sort"];

  let isInclude = arr1.includes(text);
  let isFilterText = text === "Filter";
  let isDropdownFilter = dropdownFilter.includes(text);

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  return (
    <div className={css.dropdown}>
      <div
        className={`${css.outerDiv} ${isInclude ? css.filterEffect : ""}`}
        onClick={
          isFilterText
            ? () => setIsOpen((prev) => !prev)
            : () => {
                if (isDropdownFilter) {
                  toggleDropdown();
                } else {
                  handleFilter(text);
                }
              }
        }
      >
        {arr1.length + arr2.length !== 0 && isFilterText ? (
          <span className={css.filterCount}>{arr1.length + arr2.length}</span>
        ) : leftIcon ? (
          <div className={css.leftIconBox}>
            <img className={css.leftIcon} src={leftIcon} alt="icon" />
          </div>
        ) : null}
        <div className={css.text}>{text}</div>
        {rightIcon ? (
          <div className={css.rightIconBox}>
            {isInclude ? (
              <IoIosArrowUp />
            ) : (
              <img className={css.rightIcon} src={rightIcon} alt="icon" />
            )}
          </div>
        ) : null}
        {isInclude && <IoClose className={css.closeIcon} />}
      </div>
      {isDropdown && text === "Cuisines" && (
        <DropdownMenu options={cuisines} text={text} onChange={handlePopupWindowFilter} />
      )}
      {isDropdown && text === "Dietary" && (
        <DropdownMenu options={dietary} text={text} onChange={handlePopupWindowFilter} />
      )}
      {isDropdown && text === "Sort" && (
        <DropdownMenu options={sorts} text={text} onChange={handlePopupWindowFilter} />
      )}
    </div>
  );
};

const DropdownMenu = ({ text, options, onChange }) => {
  return (
    <div className={css.optionsContainer}>
      {options.map((el, idx) => (
        <label key={idx} className={css.option}>
          <input
            type={text === "Sort" ? "radio" : "checkbox"}
            value={el.value}
            name={text === "Sort" ? "sort" : el.value}
            onChange={(evt) => onChange(evt)}
          />
          {el.label}
        </label>
      ))}
    </div>
  );
};

export default FilterBox;
