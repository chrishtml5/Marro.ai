export default function SmartOnboarding() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 relative">
          <div className="bg-[#FC4503] h-2 rounded-full" style={{ width: "70%" }}></div>
          <div className="absolute -top-6 left-0 text-xs text-gray-600 font-medium">70% complete</div>
        </div>

        {/* Checklist items */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#FC4503] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Intake form</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#FC4503] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Project setup</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-500">Kickoff call</span>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button className="bg-[#FC4503] text-white text-xs px-4 py-2 rounded-full hover:bg-[#e03d02] transition-colors">
            Continue Setup
          </button>
        </div>
      </div>
    </div>
  )
}
