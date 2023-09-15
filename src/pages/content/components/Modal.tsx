import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function Modal({ isOpen, title, description, callback }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="w-full max-w-sm rounded bg-white">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 relative z-50"
              >
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2">
                {description}
              </Dialog.Description>
              {/* <p className="text-sm text-gray-500">
                Are you sure you want to delete all the history? This action
                cannot be undone.
              </p> */}
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={callback}
                >
                  Confirm
                </button>
                <button
                  className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
