import React from "react";
import { AlertCircle } from "lucide-react";

export default function DeleteModal({ show, onDeleteClick, onCloseClick }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">Delete Confirmation</h3>
        <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCloseClick} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors">
            Cancel
          </button>
          <button onClick={onDeleteClick} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
