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
import { FormFieldType } from "./forms/patient-form";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input";
import {E164Number} from 'libphonenumber-js'
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
const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { iconAlt, iconSrc, placeholder, showTimeSelect, children, fieldType } =
    props;
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
          <FormControl >
            <PhoneInput
              defaultCountry="US"
              international
              withCountryCallingCode
              className="input-phone w-full border-0 shad-input"
              placeholder={placeholder}
              onChange={field.onChange}
              value={field.value as E164Number | undefined}
            />
          </FormControl>
        </div>
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
