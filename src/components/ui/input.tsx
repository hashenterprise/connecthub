import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="border rounded px-3 py-2 w-full"
      {...props}
    />
  );
};

export default Input;