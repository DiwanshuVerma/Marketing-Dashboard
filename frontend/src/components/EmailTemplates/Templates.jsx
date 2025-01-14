import { useState } from "react";
import DataTable from 'react-data-table-component'

const Templates = ({ templates, setSelectedTemplate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [newTemplate, setNewTemplate] = useState('');

    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            width: '20%',
            sortable: false,
            cell: (row, index) => (
                <div
                    className="text-left cursor-pointer"
                    onClick={() => setSelectedTemplate(row)}
                >
                    {index + 1}
                </div>
            ),
        },
        {
            name: 'Title (En)',
            selector: (row) => row.title,
            width: '45%',
            sortable: true,
            cell: (row) => (
                <div
                    className="text-left cursor-pointer"
                    onClick={() => setSelectedTemplate(row)}
                >
                    {row.title}
                </div>
            ),
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            width: '35%',
            sortable: true,
            center: true,
            cell: (row) => (
                <div
                    className={`${row.status === 'Active' ? 'text-green-500' : 'text-red-500'} font-medium cursor-pointer`}
                    onClick={() => setSelectedTemplate(row)}
                >
                    {row.status}
                </div>
            ),
        }
    ];

    return (
        <div>
            <DataTable
                columns={columns}
                data={templates}
                pagination
                highlightOnHover
                striped
            />

        </div>
    )

}

export default Templates