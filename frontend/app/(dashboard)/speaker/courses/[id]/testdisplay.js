import React from "react";
import { Edit, Trash2, FileText, Clock, CheckCircle } from "lucide-react";
import { ListBulletIcon } from "@radix-ui/react-icons";

const TestDisplayComponent = ({ tests, onEditTest, onDeleteTest }) => {
  if (!tests || tests.length === 0) {
    return null;
  }

  return (
    <div className="droppable-section droppable-section--even ">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-primary-700" />
        <h3 className="text-lg font-medium text-white">Tests</h3>
        <span className="text-sm text-gray-400">({tests.length})</span>
      </div>

      {tests.map((test) => (
        <div key={test.test_id} className="droppable-section__header relative">
          <div className="droppable-section__title-container">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <ListBulletIcon />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white text-lg truncate">
                    {test.test_title || test.title || "Untitled Test"}
                  </h4>
                </div>

                {(test.test_description || test.description) && (
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {test.test_description || test.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {test.questions && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {test.questions.length} question
                      {test.questions.length !== 1 ? "s" : ""}
                    </span>
                  )}

                  {test.created_at && (
                    <span>
                      Created: {new Date(test.created_at).toLocaleDateString()}
                    </span>
                  )}

                  {test.updated_at && test.updated_at !== test.created_at && (
                    <span>
                      Updated: {new Date(test.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onEditTest(test)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-md transition-colors duration-200"
                title="Edit test"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDeleteTest(test.test_id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors duration-200"
                title="Delete test"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestDisplayComponent;
