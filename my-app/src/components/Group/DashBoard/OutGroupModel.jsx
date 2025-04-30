import React from 'react';

const OutGroupModel = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">{message}</h2>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-200 p-2 rounded-lg"
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-red-500 text-white p-2 rounded-lg"
                        onClick={onConfirm}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OutGroupModel;
