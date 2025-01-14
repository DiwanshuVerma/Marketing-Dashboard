
import { createContext } from "react";

const selectedTemplateContext = createContext({
    setSelectedTemplate: (value) => {
        return value
    },
    selectedTemplate: setSelectedTemplate,
})

export default selectedTemplateContext;