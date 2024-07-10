import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );
  return (
    <div className=" flex flex-col h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo-full.svg"}
            width={1000}
            height={1000}
            alt="logo"
            className=" h-10"
          />
        </Link>
    
      <section className="flex flex-col items-center">
        <Image
          src={"/assets/gifs/success.gif"}
          height={300}
          width={280}
          alt="success"
        />
        <h2 className="header mb-6 text-center max-w-[600px]">
          Your <span className=" text-green-500">appointment request</span> has
          been submitted successfully.
        </h2>
        <p>We will be in touch shortly to confirm the appointment.</p>
      </section>
      <section className="request-details">
        <p>Requested appointment details</p>
        <div className="flex items-center gap-3">
          <Image src={doctor?.image!} width={100} height={100} alt="doctor" className="h-10 w-fit" />
          <p className=" whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
        <div className="flex gap-2">
          <Image
            src={"/assets/icons/calendar.svg"}
            width={24}
            height={24}
            alt="calendar"
          />
          <p>{formatDateTime(appointment.schedule).dateTime}</p>
        </div>
      </section>
      <Button variant={"outline"} asChild className=" shad-primary-btn">
        <Link href={`/patients/${userId}/new-appointment`}>
          New Appointment
        </Link>
      </Button>
      </div>
    </div>
  );
};

export default SuccessPage;