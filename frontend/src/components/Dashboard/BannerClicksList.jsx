export const BannerClicksList = ({ banners, timeframe }) => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Detailed Banner Performance
        </h3>
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{banner.title}</span>
                <span className="text-sm text-blue-600 font-semibold">
                  Total: {banner.totalClicks}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 mb-1">Today</p>
                  <p className="font-semibold">{banner.dailyClicks}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 mb-1">This Week</p>
                  <p className="font-semibold">{banner.weeklyClicks}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 mb-1">This Month</p>
                  <p className="font-semibold">{banner.monthlyClicks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };