import React, { Fragment, useState } from 'react';
import { Dialog as HeadlessUIDialog, Transition } from '@headlessui/react';

interface DialogProps {
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <DialogTrigger onClick={openDialog}>Open Dialog</DialogTrigger>
      <Transition appear show={isOpen} as={Fragment}>
        <HeadlessUIDialog as="div" className="relative z-10" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <HeadlessUIDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {children}
                </HeadlessUIDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </HeadlessUIDialog>
      </Transition>
    </>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => (
  <div className="mt-2">
    {children}
  </div>
);

interface DialogHeaderProps {
  children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="mt-4">
    {children}
  </div>
);

interface DialogTitleProps {
  title: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ title }) => (
  <HeadlessUIDialog.Title
    as="h3"
    className="text-lg font-medium leading-6 text-gray-900"
  >
    {title}
  </HeadlessUIDialog.Title>
);

interface DialogTriggerProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ onClick, children }) => (
  <button
    type="button"
    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    onClick={onClick}
  >
    {children}
  </button>
);

export default Dialog;