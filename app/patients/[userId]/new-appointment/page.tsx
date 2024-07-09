import AppointmentForm from "@/components/forms/appointment-form";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId);
  return (
    <div className=" h-screen max-h-screen flex">
      {/* left side appointment form  */}
      <section className=" remove-scrollbar container my-auto">
        <div className=" sub-container max-w-[860px] flex-1 justify-between">
          <Image
            width={1000}
            height={1000}
            alt="logo"
            src={"/assets/icons/logo-full.svg"}
            className=" mb-12 h-10 w-auto"
          />
          {/* <PatientForm /> */}
          <AppointmentForm
            type="create"
            patientId={patient.$id}
            userId={userId}
          />
          <small className="pt-2 justify-items-end text-dark-600 lg:text-left">
            {new Date().getFullYear()} &copy; Care Plus
          </small>
        </div>
      </section>
      {/* right side cover image  */}
      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="cover-photo"
        className=" max-w-[390px] bg-bottom"
      />
    </div>
  );
}
