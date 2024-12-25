import { FormControl, FormLabel, Grid, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const CustomFiled = ({
  id,
  label,
  required = false,
  control,
  name,
  rules = {},
  inputType,
  variant = "TextField",
  inputProps = {},
  options = [],
  hasIcon,
  placeholder,
  rows,
  multiline = false,
}) => {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Grid item xs={4} alignItems="center">
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      </Grid>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) => {
          const errorText =
            (() => {
              if (fieldState.error?.type === "required" && !fieldState.error.message) {
                return `${label} is required`;
              }
              return fieldState.error?.message || null;
            },
            [fieldState.error]);
          switch (variant) {
            case "TextField":
              return (
                <TextField
                  id={id}
                  rows={rows}
                  multiline={multiline}
                  name={name}
                  type={inputType}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!fieldState.error}
                  helperText={errorText}
                  {...inputProps}
                />
              );
            case "Select":
              return (
                <Select
                  id={id}
                  {...inputProps}
                  required={!!rules.required}
                  value={field.value || ""}
                  error={fieldState.error}
                  onChange={field.onChange}
                  placeholder={placeholder}
                  displayEmpty
                  helperText={`${label} is required`}
                >
                  <MenuItem value="">
                    <em>{placeholder}</em>
                  </MenuItem>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              );
            default:
              return null;
          }
        }}
      />
    </FormControl>
  );
};

export default CustomFiled;
