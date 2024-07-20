import React, { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const TextareaForm = forwardRef(({
  id,
  name,
  defaultValue,
  inputClassName,
  rules = {},
  errorClassName = '',
  textMessages,
  onChange,
  onPaste,
  ...rest
}, ref) => {
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
            id={id}
            placeholder={textMessages}
            className={`${inputClassName} || 'form-control form-control-simple no-resize'}`}
            style={{
              minHeight: '38px',
              maxHeight: '200px',
            }}
            {...field}
            {...rest}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) onChange(e);
            }}
            onPaste={(e) => {
              if (onPaste) onPaste(e);
            }}
            ref={ref}
          />
          {error?.message && <div className={errorClassName}>{error.message}</div>}
        </>
      )}
    />
  );
});

export default TextareaForm;
