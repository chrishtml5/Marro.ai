export default function ProposalsContracts() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 relative">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        {/* Orange header bar */}
        <div className="h-3 bg-[#FC4503] rounded-t-lg"></div>

        {/* Document content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Signature section - static display */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#FC4503]">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Signature</span>
              </div>
              <div className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                Ready to Sign
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
