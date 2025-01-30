// src/data/offersData.js

// A larger initial array of offers, each indicating its scope:
//   - scope: "category" => requires `categoryName`
//   - scope: "subcategory" => requires `subCategoryName`
//   - scope: "item" => requires `itemIds` array
export const initialOffers = [
  {
    id: "offer-cat-1",
    name: "20% Off All Starters",
    discount: "20%",
    type: "Menu-wide discounts",
    status: "Active",
    startDate: "2024-12-31",
    endDate: "2024-12-31",
  },
  {
    id: "offer-subcat-1",
    name: "15% Off Veg Starters",
    discount: "15%",
    type: "Restaurant-wide",
    status: "Active",
    startDate: "2025-12-31",
    endDate: "2025-12-31",
  },
  {
    id: "offer-item-1",
    name: "BOGO Paneer Tikka",
    discount: "BOGO",
    type: "Restaurant-wide",
    status: "Active",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
  },

  // --- NEW OFFERS BELOW ---

  {
    id: "offer-subcat-2",
    name: "10% Off Non-Veg Starters",
    discount: "10%",
    type: "Menu-wide discounts",
    status: "Active",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
  },
  {
    id: "offer-cat-2",
    name: "30% Off All Main Course",
    discount: "30%",
    type: "Dish-specific",
    status: "Active",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
  },
  {
    id: "offer-item-2",
    name: "Free Drink with Butter Chicken",
    status: "Active",
    type: "Menu-wide discounts",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
  },
  {
    id: "offer-subcat-3",
    name: "5% Off All Veg Main Course",
    discount: "5%",
    type: "Menu-wide discounts",
    status: "Active",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
  },
  {
    id: "offer-item-3",
    name: "BOGO Tandoori Wings",
    discount: "BOGO",
    type: "Menu-wide discounts",
    status: "Active",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
  },
];
