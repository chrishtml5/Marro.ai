export default function ROIAnalytics() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="flex items-center gap-6">
        {/* Line chart */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-20 relative">
            <svg className="w-full h-full" viewBox="0 0 128 80">
              <polyline
                fill="none"
                stroke="#FC4503"
                strokeWidth="2"
                points="0,60 20,45 40,50 60,30 80,35 100,15 128,10"
              />
              <circle cx="128" cy="10" r="3" fill="#FC4503" />
            </svg>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">Savings this month</p>
            <p className="text-2xl font-bold text-[#FC4503]">$12,400</p>
          </div>
        </div>

        {/* Report tile */}
        <div className="bg-white rounded-lg shadow-sm border p-4 w-24">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-[#FC4503]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xs text-center">Download Report</span>
          </div>
        </div>
      </div>
    </div>
  )
}
