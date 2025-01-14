import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom'

import { FaSearch, FaSyncAlt, FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import TopBar from '../components/TopBar';
import LeftPanel from '../components/EmailTemplates/LeftPanel';
import RightPanel from '../components/EmailTemplates/RightPanel';



const initialTemplates = [
  { id: 1, title: 'Forgot Password', emailSubject: 'wowwo', status: 'Active', emailBody: 'Hii Golu, ' },
  { id: 2, title: 'Order Receive Alert', status: 'Active', emailBody: 'Hii Diwansoo, ' },
  { id: 3, title: 'Promotional Email', status: 'Inactive', emailBody: 'Hii Diwanshu, ' },
  { id: 4, title: 'User Added', status: 'Active', emailBody: 'Hii user, ' },
  { id: 5, title: 'Order Placed', status: 'Active', emailBody: 'Hii anish, ' },
  { id: 6, title: 'Welcome new User', status: 'Inactive', emailBody: 'Hii ishu, ' },
  { id: 7, title: 'Order Cancelled', status: 'Active', emailBody: 'Hii aman, ' },
  { id: 8, title: 'Order Failed', status: 'Inactive', emailBody: 'Hii aman, Quote of the day: ' },
]


const EmailTemplateManagement = () => {
  const localStorageTemplates = JSON.parse(localStorage.getItem('templates')) || initialTemplates

  const [templates, setTemplates] = useState(localStorageTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState(null); // To store selected template data
  const [selectedTemplateDefault, setSelectedTemplateDefault] = useState({ title: '', emailBody: '' })
  const [handleTemplate, setHandleTemplate] = useState(true)

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates])


  const handleUpdateTemplate = (templateId, updatedFields) => {

    setTemplates(prevTemplates =>
      prevTemplates.map(prevTemplate =>
        prevTemplate.id === templateId ? { ...prevTemplate, ...updatedFields } : prevTemplate
      )
    )

    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate(prev => ({ ...prev, ...updatedFields }))
    }
  }

    const handleDeleteTemplate = (id) => {
      
      setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== id))

      setSelectedTemplate(null)
      setHandleTemplate(true)
    }

  useEffect(() => {
    if (selectedTemplate) {
      setHandleTemplate(false)
    }
  }, [selectedTemplate])



  const handleSave = () => {
    if (!selectedTemplateDefault.title.trim()) {
      alert("Title is required to save the template.");
      return;
    }
  
    const isNewTemplate = !templates.some(
      (template) => template.title === selectedTemplateDefault.title
    );
  
    if (isNewTemplate) {
      // Add new template
      setTemplates([...templates, { ...selectedTemplateDefault, id: Date.now() }]);
    } else {
      // Update existing template
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.title === selectedTemplateDefault.title ? selectedTemplateDefault : template
        )
      );
    }
  
    setIsEditMode(false); // Exit edit mode
    setSelectedTemplateDefault({ title: '', emailBody: '' }); // Reset the form
  };



  return (
    <div className="flex flex-col h-screen">
      <TopBar title='Email Templates' placeholder='Search templates' />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel setSelectedTemplate={setSelectedTemplate}
          setHandleTemplate={setHandleTemplate} templates={templates} heading={'Templates'} />

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
  )
}
export default EmailTemplateManagement;
