import { IoCloseOutline } from 'react-icons/io5';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileType: 'pdf' | 'excel';
    excelData: { headers: string[]; rows: any[][] } | null | undefined;
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
                        {fileType === 'pdf' ? (
                            <iframe
                                src={`${fileUrl}#toolbar=0`}
                                className="w-full h-full rounded-lg"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="overflow-auto h-full">
                                {excelData && (
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                {excelData.headers.map((header, index) => (
                                                    <th key={index} className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {excelData.rows.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {row.map((cell, cellIndex) => (
                                                        <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 