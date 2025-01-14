import { useEffect, useState } from "react"
import EmailTemplateEdit from "../EmailTempalateEdit"
import HeaderComponent from "../RightPanel/HeaderComponent"
import ActionButtonsComponent from "../RightPanel/ActionButtonsComponent"

const RightPanel = ({ selectedTemplate, handleUpdateTemplate, handleDeleteTemplate, setTemplates, handleTitle }) => {
    const [isEditMode, setIsEditMode] = useState(false)

    const [data, setData] = useState(selectedTemplate || {})

    useEffect(() => {
        if (selectedTemplate) {
            setData({ ...selectedTemplate })
        }
    }, [selectedTemplate])


    const handleFieldChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }));
        console.log('data after change: ', data)
      }

      const handleSave = () => {
        const updatedFields = {...data}
        handleUpdateTemplate(data.id, updatedFields);
        console.log('updated fields:', updatedFields)
        setIsEditMode(false);
      }

      const handleCancel = () => {
        setData({ ...selectedTemplate })
        setIsEditMode(false);
      };

      const handleDelete = () => {
        if(window.confirm('Are you sure?')){
         handleDeleteTemplate(data.id)
        }
      }

    return (
        <div className="w-3/5 p-6 bg-white shadow-md border-l border-gray-200 overflow-y-auto">
            <HeaderComponent
                title={data.title || 'Untitled'}
                isEditMode={isEditMode}
                onEdit={() => setIsEditMode(true)}
                onCancel={handleCancel}
                onChange={handleFieldChange}
                onDelete={ handleDelete}
            />
            <EmailTemplateEdit
                template={data}
                isEditMode={isEditMode}
                onChange={handleFieldChange}
            />
            {isEditMode && (
                <ActionButtonsComponent
                onSave={handleSave} onCancel={handleCancel} />
            )}
        </div>
    )
}


export default RightPanel