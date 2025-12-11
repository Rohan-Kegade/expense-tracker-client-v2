import { X } from "lucide-react";

export function ProfileModal({ user, onClose }: { user: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        <div className="space-y-3">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          {/* Add more fields if needed */}
        </div>
      </div>
    </div>
  );
}
