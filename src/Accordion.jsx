import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function Accordion({ items, defaultOpen = -1 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[24px] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
            >
              <span className="font-sans font-medium text-lg text-[#111111] pr-6">
                {item.title}
              </span>
              <div className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 text-[#666666] transition-colors duration-300">
                {isOpen ? (
                  <Minus strokeWidth={1.5} className="w-4 h-4" />
                ) : (
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                )}
              </div>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 md:px-8 pb-8 pt-0 text-sm md:text-base font-sans text-[#666666] leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
