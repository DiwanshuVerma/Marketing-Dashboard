import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useFetcher } from 'react-router-dom';
import { FaToggleOff } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const EmailTemplateEdit = ({ template, onChange, isEditMode }) => {
  const [emailSubject, setEmailSubject] = useState(template.emailSubject || '')
  const [emailBody, setEmailBody] = useState(template.emailBody || 'Hi [Name],')

  useEffect(() => {
    setEmailBody(template.emailBody || 'Hi [Name],')
    setEmailSubject(template.emailSubject || '')
  }, [template])

  const handleSubjectChange = (e) => {
    const newValue = e.target.value;
    setEmailSubject(newValue);

    if (onChange) {
      onChange('emailSubject', newValue);  // Use newValue, not emailSubject
    }
  }

  const handleBodyChange = (value) => {
    setEmailBody(value);

    if (onChange) {
      onChange('emailBody', value);
    }
  }

  return (
    <div className="bg-white flex flex-col gap-2 mt-8">
      <div className="mb-8">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailSubject">
          Email Subject
        </label>
        <input
          id="emailSubject"
          type="text"
          value={emailSubject}
          disabled={!isEditMode}
          onChange={handleSubjectChange}  // Changed to new handler
          placeholder="Password Assistance"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="">
        <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="emailBody">
          Email Body
        </label>
        <ReactQuill
          id="emailBody"
          value={emailBody}
          disabled={!isEditMode}  // Added isEditMode check
          onChange={handleBodyChange}  // Changed to new handler
          placeholder="Type your email body here..."
          style={{ height: '250px', marginBottom: '40px' }}
        />
      </div>

      <div className='mt-4'>
        <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="status">
          Status
        </label>
        <button id='status' className='text-green-500'>
          <FaToggleOff size={30} />
        </button>
      </div>

    </div>
  );
};
export default EmailTemplateEdit;
