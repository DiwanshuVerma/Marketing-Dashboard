import { FiDownload, FiPlus } from 'react-icons/fi';
import { useState, Suspense, lazy } from 'react';
import jsPDF from 'jspdf';

const Templates = lazy(() => import('./Templates')); // Lazy load Templates

const LeftPanel = ({ setSelectedTemplate, setHandleTemplate, templates }) => {
    const [selectedType, setSelectedType] = useState('User'); // State to track the selected type ('user' or 'restaurant')


    // download all the email templates


    const downloadTemplatesAsPDF = async () => {
      try {
        const response = await fetch("https://marketing-dashboard-8274.onrender.com/templates/templates-grouped");
        const groupedTemplates = await response.json();
    
        const doc = new jsPDF();
        let y = 10;
    
        for (const [type, templates] of Object.entries(groupedTemplates)) {
          // Add the template type heading
          doc.setFontSize(16);
          doc.text(`${type} Email Templates`, 10, y);
          y += 10;
    
          templates.forEach((template) => {
            // Add the title
            doc.setFontSize(14);
            doc.text(`Title: ${template.title}`, 10, y);
            y += 10;
    
            // Add the subject
            if (template.emailSubject) {
              doc.setFontSize(12);
              doc.text(`Subject: ${template.emailSubject}`, 10, y);
              y += 10;
            }
    
            // Add the email body
            if (template.emailBody) {
              doc.setFontSize(12);
              doc.text("Body:", 10, y);
              y += 10;
    
              const plainTextBody = template.emailBody.replace(/<[^>]*>/g, ""); // Remove HTML tags
              const wrappedText = doc.splitTextToSize(plainTextBody, 180); // Wrap text within page width
              doc.text(wrappedText, 10, y);
            //   y += 10;
    
              //y += wrappedText.length * 10; // Adjust y for the next template
            }
    
            // Add spacing between templates
            y += 10;
          });
        }
    
        doc.save("email-templates.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };
    



    const handleAddTemplate = () => {
        setSelectedTemplate(null);
        setHandleTemplate((prev) => !prev);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    // Filter templates based on the selected type
    const filteredTemplates = templates.filter((template) => template.type === selectedType);

    return (
        <div className=" w-2/5 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-8">
            <div className="flex justify-between items-center">
                {/* Buttons to toggle template type */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleTypeChange('User')}
                        className={`text-xl p-1 border-b-[3px] font-semibold text-gray-700 ${
                            selectedType === 'User' ? 'border-red-600' : 'border-transparent'
                        }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => handleTypeChange('Restaurant')}
                        className={`text-xl p-1 border-b-[3px] font-semibold text-gray-700 ${
                            selectedType === 'Restaurant' ? 'border-red-600' : 'border-transparent'
                        }`}
                    >
                        Restaurants
                    </button>
                </div>

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
                        onClick={downloadTemplatesAsPDF}
                    >
                        <FiDownload size={20} />
                    </button>
                </div>
            </div>

            {/* Render filtered templates */}
            <Suspense fallback={<div>Loading templates...</div>}>
                <Templates setSelectedTemplate={setSelectedTemplate} templates={filteredTemplates} />
            </Suspense>
        </div>
    );
};

export default LeftPanel;
