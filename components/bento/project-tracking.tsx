export default function ProjectTracking() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 relative">
      <div className="w-full max-w-md">
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200"></div>
          <div className="absolute top-4 left-4 w-2/3 h-0.5 bg-[#FC4503]"></div>

          {/* Timeline milestones */}
          <div className="flex justify-between relative">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FC4503] rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Scope</span>
              <span className="text-xs text-gray-500">Jan 15</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FC4503] rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Build</span>
              <span className="text-xs text-gray-500">Feb 1</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full mb-2"></div>
              <span className="text-sm text-gray-500">Review</span>
              <span className="text-xs text-gray-400">Feb 15</span>
            </div>
          </div>
        </div>

        {/* Status indicator - static display */}
        <div className="flex justify-center mt-6">
          <div className="text-xs px-4 py-2 rounded-full bg-gray-100 text-gray-600">
            Project Timeline
          </div>
        </div>
      </div>
    </div>
  )
}
