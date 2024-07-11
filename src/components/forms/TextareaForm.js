import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export const TextareaForm = ({
  name, defaultValue,
  inputClassName, rules={},
  errorClassName = "",
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          <textarea
            className={inputClassName || "form-control form-control-simple no-resize"}
            {...field}
            {...rest}
            placeholder="Type your message..."
          ></textarea>
          {error?.message && (<div className={errorClassName}>{error.message}</div>)}
        </>
      )}
    />
  );
};

export default TextareaForm;
