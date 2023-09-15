// import { Fragment, useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";

function Modal({ isOpen, title, description, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50 h-screen"></div>
      <div className="p-4 rounded-md bg-gh-med-gray z-50">
        <h3 className="text-lg font-medium leading-6 text-gh-text-color mb-2">
          {title}
        </h3>
        <p className="mb-4">{description}</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
