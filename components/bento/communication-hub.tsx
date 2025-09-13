export default function CommunicationHub() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        {/* Team message */}
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2 shadow-sm border-l-2 border-[#FC4503]">
            <p className="text-sm">Design mockups are ready for review</p>
            <span className="text-xs text-gray-500">Team • 2:30 PM</span>
          </div>
        </div>

        {/* Client message */}
        <div className="flex justify-end">
          <div className="bg-gray-100 rounded-2xl rounded-br-md px-4 py-2">
            <p className="text-sm">Looks great! Just one small change needed</p>
            <span className="text-xs text-gray-500">Client • 2:45 PM</span>
          </div>
        </div>

        {/* Approval notification */}
        <div className="flex justify-center">
          <div className="bg-[#FC4503] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Client Approved
          </div>
        </div>
      </div>
    </div>
  )
}
