import React, { useEffect, useState } from 'react';

import TopBar from '../components/TopBar';
import LeftPanel from '../components/EmailTemplates/LeftPanel';
import RightPanel from '../components/EmailTemplates/RightPanel';

const EmailTemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplateDefault, setSelectedTemplateDefault] = useState({ title: '', emailBody: '' });
  const [handleTemplate, setHandleTemplate] = useState(true);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:5000/templates');
      const data = await response.json();
      setTemplates(data); // Setting templates to the fetched data
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []); // initial fetch
  

  const handleUpdateTemplate = async (templateId, updatedFields) => {
    if (!updatedFields.title.trim()) {
      alert("Title is required to save the template.");
      return;
    }

    try {
      const method = templateId ? 'PUT' : 'POST';
      const url = templateId
        ? `http://localhost:5000/templates/${templateId}`
        : 'http://localhost:5000/templates';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();
      fetchTemplates()                         /////=---------------
      if (templateId) {
        // Update existing template
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template._id === templateId ? data : template
          )
        );
      } else {
        // Add new template
        setTemplates((prevTemplates) => [...prevTemplates, data]);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };  

  const handleDeleteTemplate = async (id) => {
    try {
      await fetch(`http://localhost:5000/templates/${id}`, { method: 'DELETE' });
      setTemplates((prevTemplates) => prevTemplates.filter((template) => template._id !== id));

      if(selectedTemplate && selectedTemplate._id === id){
       setSelectedTemplate(null)
      }
      fetchTemplates()

    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      setHandleTemplate(false);
    }
  }, [selectedTemplate]);

  return (
    <div className="flex flex-col h-full">
      <TopBar title='Email Templates' placeholder='Search templates' />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel setSelectedTemplate={setSelectedTemplate}
          setHandleTemplate={setHandleTemplate} templates={templates} heading={'User Templates'} />

        {selectedTemplate ? (
          <RightPanel
            selectedTemplate={selectedTemplate}
            setTemplates={setTemplates} templates={templates}
            handleUpdateTemplate={handleUpdateTemplate}
            handleDeleteTemplate={handleDeleteTemplate} />
        ) : (
          <RightPanel selectedTemplate={selectedTemplateDefault}
            setTemplates={setTemplates} templates={templates}
            handleUpdateTemplate={handleUpdateTemplate} />
        )}
      </div>
    </div>
  );
};

export default EmailTemplateManagement;
