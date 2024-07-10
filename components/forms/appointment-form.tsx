"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAppointmentSchema } from "@/lib/validation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case "create":
        status = "pending";
        break;
      case "cancel":
        status = "cancelled";
        break;
      case "schedule":
        status = "scheduled";
        break;

      default:
        status = "pending";
        break;
    }
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patients: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className=" space-y-4">
          <h1 className=" header">New Appointment</h1>
          <p className=" text-dark-700">
            Request a new appointment in 10 seconds.
          </p>
        </section>
        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name={"primaryPhysician"}
              label={"Doctors"}
              placeholder={"Select a Doctor"}
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
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name={"schedule"}
              label={"Expected appointment date"}
              showTimeSelect={true}
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name={"reason"}
                label={"Reason for appointment"}
                placeholder={"Enter reason for appointment"}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name={"note"}
                label={"Notes"}
                placeholder={"Enter additional notes for appointment"}
              />
            </div>
          </>
        )}
        {type == "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name={"reason"}
              label={"Reason for cancellation"}
              placeholder={"Enter reason for cancellation"}
            />
          </>
        )}

        <SubmitButton
          className={`${
            type == "cancel" ? "shad-danger-btn" : " shad-primary-btn"
          }`}
          isLoading={isLoading}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
