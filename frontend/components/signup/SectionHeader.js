import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const SectionHeader = memo(({ title, isExpanded, onToggle, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="border border-gray-200 rounded-lg mb-4"
  >
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-600" />
      )}
    </button>
    {isExpanded && (
      <div className="p-4 space-y-4">
        {children}
      </div>
    )}
  </motion.div>
));

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader; 
