import { FaEdit } from 'react-icons/fa';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { useState, Suspense, lazy } from 'react';
import RightPanel from './RightPanel';

const Templates = lazy(() => import('./Templates')); // Lazy load Templates

const LeftPanel = ({heading, setSelectedTemplate, setHandleTemplate, templates }) => {
    const handleAddTemplate = () => {
        setSelectedTemplate(null);
        setHandleTemplate((pre) => !pre);
    };

    return (
        <>
            <div className="w-2/5 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">{heading}</h2>

                    <div className="flex gap-4">
                        <button
                            className="text-lg text-blue-500 rounded hover:text-blue-600"
                            onClick={handleAddTemplate}
                            title="Add Template"
                        >
                            <FiPlus />
                        </button>

                        <button
                            className="text-lg text-blue-500 rounded hover:text-blue-600"
                            title="Download Templates"
                        >
                            <FiDownload size={20} />
                        </button>
                    </div>
                </div>

                {/* Wrap Templates in Suspense for lazy loading */}
                <Suspense fallback={<div>Loading templates...</div>}>
                    <Templates setSelectedTemplate={setSelectedTemplate} templates={templates} />
                </Suspense>
            </div>
        </>
    );
};

export default LeftPanel;
