import { useNavigate } from "react-router-dom";
import { useResource } from "../../context/Banner_CollectionContext";
import {useOffers} from "../../context/OffersContext"


// Sample data for demonstration
const stats = [
  {
    label: "Banners (All)",
    value: 78,
    bg: "bg-pink-600",
    path: "/campaign-management"
  },
  {
    label: "Banner clicks",
    value: 123,
    bg: "bg-blue-600",
    path: "/campaign-management"
  },
  {
    label: "Restaurant Offers",
    value: 11,
    bg: "bg-green-600",
    path: "/RestaurantOffers"
  },
];


const DashboardStats = () => {
  const { resources } = useResource()
  const { offers } = useOffers()
  const navigate = useNavigate();
  
  console.log(resources.length)

  const filteredValue = (label) => {
    if(label === 'Banners (All)'){
      return resources?.length
    } else if(label === 'Banner clicks') {
      return resources.reduce((total, banner) => total + (banner.clicks.length), 0)
    } else if(label === 'Restaurant Offers') {
      return offers?.length
    } else {
      return 0
    }
  }

  return (
    <div className="">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between p-4 rounded shadow text-white ${stat.bg}`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium opacity-90">
                {stat.label}
              </span>
              <span className="text-xl font-bold mt-1">{filteredValue(stat.label)}
              </span>
            </div>
            {/* Icon placeholder (replace with actual icons if you like) */}
            <svg
              className="w-8 h-8 opacity-75 cursor-pointer"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              onClick={() =>  navigate(stat.path)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5l-7 7 7 7M5 12h14"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats;