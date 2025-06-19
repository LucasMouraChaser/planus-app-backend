
"use client";

import type React from 'react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name: string;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
  isTextarea?: boolean;
  isOverlapping?: boolean;
  fieldRef?: (el: SVGForeignObjectElement | null) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  x, y, width, height, value, onChange, name, inputStyle, inputClassName, isTextarea = false, isOverlapping = false, fieldRef
}) => {
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  const combinedStyle: React.CSSProperties = {
    ...inputStyle,
  };

  // Removed the following block to disable red highlighting for overlaps
  // if (isOverlapping) {
  //   combinedStyle.border = '2px solid red';
  //   combinedStyle.backgroundColor = 'rgba(255, 0, 0, 0.05)';
  // }


  const fullSizeAndFontStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '0', 
    margin: '0', 
    boxSizing: 'border-box',
    lineHeight: inputStyle?.lineHeight || '1.0', 
    fontSize: inputStyle?.fontSize,
    fontWeight: inputStyle?.fontWeight,
    color: inputStyle?.color,
    letterSpacing: inputStyle?.letterSpacing,
    background: inputStyle?.background || 'transparent', // Ensure background from style is applied or transparent
  };


  return (
    <foreignObject x={x} y={y} width={width} height={height} ref={fieldRef}>
      <InputComponent
        type={isTextarea ? undefined : 'text'}
        name={name}
        value={value}
        onChange={onChange}
        style={{...fullSizeAndFontStyles, ...combinedStyle}}
        className={cn(inputClassName)} 
        aria-label={name} 
      />
    </foreignObject>
  );
};

export default EditableField;

