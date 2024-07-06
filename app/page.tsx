import PatientForm from "@/components/forms/patient-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" h-screen max-h-screen flex">
      {/* TODO:: OTP Verification | Passkey Modal */}
      {/* left side patient form  */}
      <section className=" remove-scrollbar container my-auto">
        <div className=" sub-container max-w-[496px]">
          <Image
            width={1000}
            height={1000}
            alt="logo"
            src={"/assets/icons/logo-full.svg"}
            className=" mb-12 h-10 w-auto"
          />
          <PatientForm />
          <div className="mt-12 flex justify-between text-14-regular">
            <p className=" justify-items-end text-dark-600 lg:text-left">
              {new Date().getFullYear()} &copy; Care Plus
            </p>
            <Link href={"/?admin=true"} className=" text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      {/* right side cover image  */}
      <Image
        src={"/assets/images/onboarding-img.png"}
        height={1000}
        width={1000}
        alt="cover-photo"
        className=" max-w-[50%] side-img"
      />
    </div>
  );
}
