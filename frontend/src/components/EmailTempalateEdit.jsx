import React, { useEffect, useRef, useState } from 'react';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
import JoditEditor from 'jodit-react';

const EmailTemplateEdit = ({ template, onChange, isEditMode }) => {
  const editorRef = useRef(null);
  const [emailSubject, setEmailSubject] = useState(template.emailSubject || '');
  const [emailBody, setEmailBody] = useState(template.emailBody || 'Hi [Name],');
  const [isActive, setIsActive] = useState(true)


  useEffect(() => {
    setEmailBody(template.emailBody || 'Hi [Name],');
    setEmailSubject(template.emailSubject || '');
  }, [template]);

  const handleSubjectChange = (e) => {
    const newValue = e.target.value;
    setEmailSubject(newValue);

    if (onChange) {
      onChange('emailSubject', newValue);
    }
  };

  const handleBlur = (newContent) => {
    setEmailBody(newContent);
    if (onChange) {
      onChange('emailBody', newContent);
    }
  };

  const editorConfig = {
    readonly: !isEditMode, // Allow editing only if isEditMode is true
    toolbarSticky: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      'link',
      '|',
      'align',
      '|',
      'undo',
      'redo',
      'font',
      'fontsize',
      'brush',
    ],
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  };

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
          onChange={handleSubjectChange}
          placeholder="Password Assistance"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="emailBody">
          Email Body
        </label>
        <JoditEditor
          ref={editorRef}
          value={emailBody}
          config={editorConfig}
          tabIndex={1}
          onBlur={handleBlur} // Save content on blur
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="status">
          Status
        </label>
        <div className='flex gap-4 items-center'>
        <button id="status" className={`${isActive ? 'text-green-500' : 'text-gray-500'}`} onClick={() => setIsActive(pre => !pre)}>
          {isActive ? <FaToggleOn size={30} /> : (<FaToggleOff size={30} />)}
        </button>
        <p className={`${isActive ? 'text-green-500' : 'text-red-500'}`}>{isActive ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEdit;
