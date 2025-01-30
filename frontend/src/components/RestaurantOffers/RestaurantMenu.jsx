import { useEffect, useState } from "react";
import { initialOffers } from "../../data/offersData";
import dummy from "../../data/dummy";

const RestaurantMenu = ({ SelectedRestaurant }) => {
  const [restaurant, setRestaurant] = useState(SelectedRestaurant);

  useEffect(() => {
    setRestaurant(SelectedRestaurant);
    console.log('changes: ')
  }, [SelectedRestaurant]);

  const { restaurants } = dummy;

  // Function to merge all items under the same category and subcategory
  const getMergedCategories = () => {
    const mergedCategories = {};

    restaurants.forEach((res) => {
      res.categories.forEach((category) => {
        if (!mergedCategories[category.name]) {
          mergedCategories[category.name] = {};
        }

        category.subcategories.forEach((subcategory) => {
          if (!mergedCategories[category.name][subcategory.name]) {
            mergedCategories[category.name][subcategory.name] = [];
          }

          // Merge all items from different restaurants
          mergedCategories[category.name][subcategory.name].push(
            ...subcategory.items
          );
        });
      });
    });

    // Convert mergedCategories into an array format
    return Object.keys(mergedCategories).map((categoryName) => ({
      name: categoryName,
      subcategories: Object.keys(mergedCategories[categoryName]).map((subName) => ({
        name: subName,
        items: mergedCategories[categoryName][subName],
      })),
    }));
  };

  // Determine which categories to display
  const displayedCategories = restaurant ? restaurant.categories : getMergedCategories();

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg overflow-y-auto h-[490px]">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-center">
          {restaurant ? `${restaurant.name} - Menu` : "Apply Offer on Menus"}
        </h2>
        <div>
          <label htmlFor="offers" className="text-lg mr-3">Select Offer:</label>
          <select name="offers" id="offers" className="p-1 rounded">
            <option value="" className="text-center">--Select--</option>
            {initialOffers.map((offer, offerIndex) => (
              <option key={offerIndex} value={offer.name}>{offer.name}</option>
            ))}
          </select>
        </div>
      </div>

      {displayedCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="flex gap-4 mb-6">
          <h3 className="text-xl font-semibold w-32">{category.name}</h3>
          <div className="flex flex-wrap gap-4">
            {category.subcategories.map((subcategory, subIndex) => (
              <div key={subIndex} className="flex-1 whitespace-nowrap w-[240px]">
                <label className="font-medium text-lg flex items-center">
                  <input type="checkbox" className="mr-2" />
                  {subcategory.name}
                </label>
                <ul className="text-gray-700 mt-2 ml-6 flex flex-col gap-2">
                  {subcategory.items.map((item, itemIndex) => (
                    <>
                  <input type="checkbox" className="" />

                    <li key={itemIndex}>{item}</li>
                    </>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;