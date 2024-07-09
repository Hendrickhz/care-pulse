"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  placeholder?: string;
  label?: string;
  iconAlt?: string;
  iconSrc?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: string;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode; //can be used to show a loading stage for input
}
export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  SELECT = "select",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}
const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    iconAlt,
    iconSrc,
    placeholder,
    dateFormat,
    showTimeSelect,
    children,
    renderSkeleton,
    fieldType,
    disabled,
    name,
    label,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className=" flex rounded-md  border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={iconAlt || "Icon"}
              className=" ml-2"
            />
          )}
          <FormControl>
            <Input
              className=" shad-input border-0"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            international
            withCountryCallingCode
            className="input-phone "
            placeholder={placeholder}
            onChange={field.onChange}
            value={field.value as E164Number | undefined}
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src={"/assets/icons/calendar.svg"}
            width={24}
            height={24}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ? true : false}
              wrapperClassName=" date-picker"
              timeInputLabel="Time:"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select defaultValue={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className=" shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className=" shad-select-content">
              {children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            className=" border-0 shad-textArea"
            placeholder={placeholder}
            {...field}
            disabled={disabled}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label className="checkbox-label select-none" htmlFor={name}>
              {label}
            </label>
          </div>
        </FormControl>
      );
    default:
      break;
  }
};
const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label, placeholder } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className=" flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          {/* <FormDescription>This is your public display name.</FormDescription> */}
          <FormMessage className=" shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
