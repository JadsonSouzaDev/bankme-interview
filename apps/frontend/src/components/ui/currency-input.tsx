import React from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "./input";

interface CurrencyInputProps {
  value?: string | number;
  onChange?: (value: number) => void;
  error?: boolean;
  className?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

export const CurrencyInput = ({ 
  value, 
  onChange, 
  error, 
  className, 
  placeholder = "0,00",
  ...props 
}: CurrencyInputProps) => {
  const handleValueChange = (values: { floatValue: number | undefined }) => {
    if (onChange) {
      onChange(values.floatValue || 0);
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm z-10">
        R$
      </span>
      <NumericFormat
        customInput={Input}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        prefix=""
        value={value}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        className={`${className || ""} ${error ? "border-red-500" : ""} pl-8`}
        {...props}
      />
    </div>
  );
};

CurrencyInput.displayName = "CurrencyInput"; 