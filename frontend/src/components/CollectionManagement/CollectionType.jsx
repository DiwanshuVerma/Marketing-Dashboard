import { useEffect, useRef, useState } from "react";
import { clientSideRestaurants } from '../../data/restaurants'
import { FaStar } from "react-icons/fa";

const CollectionType = ({ isEditMode, selectedResource, onChange, selectedRestaurants }) => {

    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [newRestaurants, setNewRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurantsPerPage, setRestaurantsPerPage] = useState(10);

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([])

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
    const [locationsDropdownOpen, setLocationsDropdownOpen] = useState(false)

    const isInternalChange = useRef(false);

    useEffect(() => {
        if (selectedTypes.length === 0 && selectedRatings.length === 0 && !searchQuery) {
            setFilteredRestaurants([]);
            return;
        }

        let filtered = clientSideRestaurants;

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(restaurant => selectedTypes.includes(restaurant.type));
        }

        // if (selectedRatings.length > 0) {
        //     filtered = filtered.filter(restaurant => selectedRatings.includes(restaurant.rating.toString()));
        // }

        if (searchQuery) {
            filtered = filtered.filter(restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // if (selectedLocations.length > 0) {
        //     filtered = filtered.filter(restaurant => selectedLocations.includes(restaurant.location));
        // }

        setFilteredRestaurants(filtered);
        setNewRestaurants(filtered.map(r => r._id));
        isInternalChange.current = true;
    }, [selectedTypes, selectedRatings, searchQuery, selectedLocations]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTypes, selectedRatings, searchQuery, restaurantsPerPage]);

    useEffect(() => {
        onChange(newRestaurants);
    }, [newRestaurants, onChange]);

    const handleTypeChange = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleRatingChange = (rating) => {
        setSelectedRatings(prev =>
            prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
        );
    };

    const handleLocationChange = (location) => {
        setSelectedLocations(prev =>
            prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
        )
    }

    const handleCheckboxChange = (restaurantId) => {
        setNewRestaurants(prev => {
            if (prev.includes(restaurantId)) {
                return prev.filter(id => id !== restaurantId);
            } else {
                return [...prev, restaurantId];
            }
        });


        // Merge with previously selected restaurants
        onChange(prevSelected => {
            if (prevSelected.includes(restaurantId)) {
                return prevSelected.filter(id => id !== restaurantId);
            } else {
                return [...prevSelected, restaurantId];
            }
        });
    };

    // filter restaurants from search
    const handleSearch = (e) => {
        const value = e.target.value;
        setFilteredRestaurants(value)
    }

    const startIndex = (currentPage - 1) * restaurantsPerPage;
    const endIndex = startIndex + restaurantsPerPage;
    const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

    return (
        <div className="my-8">
            <h3 className="text-lg text-gray-800 font-semibold mb-2">Restaurants</h3>

            {/* --------------> filters <--------------- */}
            <div className="mb-4 relative flex items-center gap-2">

                {/* --------------> types <--------------- */}
                <div className="relative z-10 w-40">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="p-1 border rounded w-full text-center bg-white"
                    >
                        {selectedTypes.length > 0 ? `Types (${selectedTypes.length})` : "--Select Types--"}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute left-0 mt-1 bg-white border w-full rounded shadow-md p-1 max-h-48 overflow-y-auto">
                            {["Newly added", "Offer Based", "Live Event", "Serves Alcohol"].map(type => (
                                <label key={type} className="flex items-center p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                        className="mr-2"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* --------------> search <--------------- */}
                <div className="">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search restaurants..."
                        className="p-1 border rounded w-full"
                    />
                </div>

                {/* ----------> ratings <--------- */}
                {filteredRestaurants.length > 0 ? <div className="relative z-10">
                    <button
                        onClick={() => setRatingDropdownOpen(!ratingDropdownOpen)}
                        className="p-1 border rounded w-20 text-center bg-white flex items-center justify-center gap-2"
                    >
                        {selectedRatings.length > 0 ? (
                            <>
                                <FaStar size={16} color="gray" />
                                {selectedRatings.join(", ")}
                            </>
                        ) : (
                            <>
                                <FaStar size={16} color="gray" />
                                <span>All</span>
                            </>
                        )}
                    </button>

                    {ratingDropdownOpen && (
                        <div className="absolute left-0 mt-1 bg-white border rounded w-full shadow-md p-2 max-h-48 overflow-y-auto">
                            {["1", "2", "3", "4", "5"].map((rating) => (
                                <label key={rating} className="flex items-center p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedRatings.includes(rating)}
                                        onChange={() => handleRatingChange(rating)}
                                        className="mr-2"
                                    />
                                    <FaStar size={16} color="gray" />
                                    <span>{rating}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div> : ''}

                {/* --------------> locations <--------------- */}

                {filteredRestaurants.length > 0 ? <div className="relative z-10 w-40">
                    <button
                        onClick={() => setLocationsDropdownOpen(!locationsDropdownOpen)}
                        className="p-1 border rounded w-full text-center bg-white"
                    >
                        {selectedLocations.length > 0 ? `Locations (${selectedLocations.length})` : "Location"}
                    </button>
                    {locationsDropdownOpen && (
                        <div className="absolute left-0 mt-1 bg-white border w-full rounded shadow-md p-1 max-h-48 overflow-y-auto">
                            {["New York", "Toronto", "New Delhi", "New Rajsth"].map(location => (
                                <label key={location} className="flex items-center p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedLocations.includes(location)}
                                        onChange={() => handleLocationChange(location)}
                                        className="mr-2"
                                    />
                                    {location}
                                </label>
                            ))}
                        </div>
                    )}
                </div> : ''}
            </div>


            {selectedTypes.length > 0 && (
                <div className='bg-gray-100 p-3 rounded'>
                    <h3 className="text-base text-gray-800 font-semibold mb-4 border-b-2 pb-2">
                        Matching Restaurants ({filteredRestaurants.length})
                    </h3>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {currentRestaurants.map((restaurant, index) => (
                            <div key={index} className="flex items-center">
                                <div className="flex-1">
                                    <div className='flex gap-2'>
                                        <span>{index + 1}.</span>
                                        <h4 className="font-medium">{restaurant.name}</h4>
                                    </div>
                                    <div className="flex gap-4 ml-5 text-xs text-gray-600">
                                        <span className='w-1/5'>Cuisine: {restaurant.cuisine}</span>
                                        <span className={
                                            restaurant.type === "Offer Based" ? "text-green-600" :
                                                restaurant.type === "Live Event" ? "text-purple-600" : "text-blue-600"
                                        }>
                                            {restaurant.type}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={newRestaurants.includes(restaurant._id)}
                                        onChange={() => handleCheckboxChange(restaurant._id)}
                                        className="mr-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>


                    {filteredRestaurants.length > 0 && (
                        <div className="mt-4 border-t border-t-gray-300 pt-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <span>Show:</span>
                                <select
                                    value={restaurantsPerPage}
                                    onChange={(e) => setRestaurantsPerPage(Number(e.target.value))}
                                    className="p-1 rounded border"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>per page</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div >
    );
};



export default CollectionType