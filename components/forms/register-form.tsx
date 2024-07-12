"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email:user.email,
      phone: user.phone,
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      //@ts-ignore
      const patient = await registerPatient(patientData);
      if(patient){
        router.push(`/patients/${user.$id}/new-appointment`)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className=" space-y-4">
          <h1 className=" header">Welcome👋</h1>
          <p className=" text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className=" sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name={"name"}
          label={"Full Name"}
          placeholder={"John Doe"}
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name={"email"}
            label={"Email Address"}
            placeholder={"johndoe@gmail.com"}
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name={"phone"}
            label={"Phone Number"}
            placeholder={"(+555) 123 456 7890"}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name={"birthDate"}
            label={"Date of Birth"}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name={"gender"}
            label={"Gender"}
            renderSkeleton={(field) => {
              return (
                <FormControl>
                  <RadioGroup
                    className=" flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className=" capitalize  cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name={"address"}
            label={"Address"}
            placeholder={"123 Abc Street, NY"}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name={"occupation"}
            label={"Occupation"}
            placeholder={"Software Engineer"}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name={"emergencyContactName"}
            label={"Emergency Contact Name"}
            placeholder={"Guardian's name"}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name={"emergencyContactNumber"}
            label={"Emergency Contact Number"}
            placeholder={"(+555) 789 456 1230"}
          />
        </div>
        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className=" sub-header">Medical Information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name={"primaryPhysician"}
          label={"Primary Physician"}
          placeholder={"Select a Physician"}
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex items-center cursor-pointer gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className=" rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name={"insuranceProvider"}
            label={"Insurance Provider"}
            placeholder={"Young Insurance"}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name={"insurancePolicyNumber"}
            label={"Insurance Policy Number"}
            placeholder={"ABC123456789"}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name={"allergies"}
            label={"Allergies (if any)"}
            placeholder={"Peanuts, Penicillin, Pollen"}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name={"currentMedication"}
            label={"Current Medication (if any)"}
            placeholder={"Ibuprofen 200mg, Paracetamol 500 mg"}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name={"familyMedicalHistory"}
            label={"Family Medical History (if any)"}
            placeholder={"Father had heart disease"}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name={"pastMedicalHistory"}
            label={"Past Medical History (if any)"}
            placeholder={"Appendectomy, Tonsillectomy"}
          />
        </div>
        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className=" sub-header">Identification And Verification</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name={"identificationType"}
          label={"Identification Type"}
          placeholder={"Select an identification type"}
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              <div className="flex items-center cursor-pointer gap-2">
                <p>{type}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name={"identificationNumber"}
          label={"Identification Number"}
          placeholder={"123456789"}
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name={"identificationDocument"}
          label={"Scanned copy of identification document"}
          renderSkeleton={(field) => {
            return (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            );
          }}
        />
        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className=" sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name={"treatmentConsent"}
          label={"I consent to treatment"}
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name={"disclosureConsent"}
          label={"I consent to disclosure of information"}
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name={"privacyConsent"}
          label={"I consent to privacy policies"}
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
