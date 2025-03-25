import { IoCloseOutline } from 'react-icons/io5';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileType: 'pdf';
    excelData: null;
}

export default function FilePreviewModal({
    isOpen,
    onClose,
    fileUrl,
    fileType,
    excelData
}: FilePreviewModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-11/12 h-5/6 max-w-6xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <IoCloseOutline className="w-6 h-6" />
                </button>

                <div className="p-6 h-full">
                    <div className="h-full">
                        <iframe
                            src={`${fileUrl}#toolbar=0`}
                            className="w-full h-full rounded-lg"
                            title="PDF Preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 