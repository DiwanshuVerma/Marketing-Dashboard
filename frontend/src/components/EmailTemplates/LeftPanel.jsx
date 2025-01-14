import { FaEdit } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'

import { useState } from 'react'
import RightPanel from './RightPanel';
import Templates from './Templates';

const LeftPanel = ({ setSelectedTemplate, setHandleTemplate, templates }) => {

    const handleAddTemplate = () => {
        setSelectedTemplate(null)
        setHandleTemplate((pre) => !pre)
    }

    return (
        <>
            <div className="w-2/5 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center ">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Templates
                    </h2>

                    <div className='flex gap-4'>
                        <button
                            className="text-lg text-blue-500 rounded hover:text-blue-600"

                            onClick={handleAddTemplate}
                            title='Add Template'
                        >
                            <FaEdit />
                        </button>

                        <button
                            className="text-lg text-blue-500 rounded hover:text-blue-600"

                            // onClick={}
                            title='Download Templates'
                        >
                            <FiDownload size={20} />
                        </button>
                    </div>
                </div>

                <Templates setSelectedTemplate={setSelectedTemplate} templates={templates} />
            </div>

        </>
    )
}

export default LeftPanel;