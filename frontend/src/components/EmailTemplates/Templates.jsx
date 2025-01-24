import { useState } from "react";

const Templates = ({ templates, setSelectedTemplate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    // Filter templates based on search term
    const filteredTemplates = templates
        .filter(template =>
            template.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setSelectedTemplateId(template._id); // Track selected template
    };

    return (
        <div className="overflow-y-auto p-4">
            <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {filteredTemplates.length > 0 ? (
                <div className="space-y-2">
                    {filteredTemplates.map((template, index) => (
                        <div
                            key={template._id}
                            className={`p-3 border flex justify-between rounded-lg cursor-pointer hover:shadow-sm ${
                                selectedTemplateId === template._id
                                    ? 'bg-gray-100'
                                    : 'bg-white'
                            }`}
                            onClick={() => handleSelectTemplate(template)}
                        >
                            <div className="text-lg">
                                {index + 1}. {template.title}
                            </div>
                            <div
                                className={`mt-1 font-medium ${
                                    template.status === 'Active'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {template.status}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500">No templates found.</div>
            )}
        </div>
    );
};

export default Templates;
