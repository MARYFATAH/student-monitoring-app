import React from "react";

export function Modal({
  title,
  children,
  onCancel,
  onSubmit,
  submitText,
  cancelText,
}) {
  return (
    <div className="fixed inset-0 bg-indigo-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-rose-500 text-white py-2 px-4 rounded"
            onClick={onCancel}
          >
            {cancelText || "Cancel"}
          </button>
          <button
            className="bg-indigo-500 text-white py-2 px-4 rounded"
            onClick={onSubmit}
          >
            {submitText || "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
