import RegisterForm from "@/components/forms/register-form";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PatientRegisterPage = async ({
  params: { userId },
}: SearchParamProps) => {
  const user = await getUser(userId);
  return (
    <div className=" h-screen max-h-screen flex">
      {/* left side patient form  */}
      <section className=" remove-scrollbar container">
        <div className=" sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            width={1000}
            height={1000}
            alt="logo"
            src={"/assets/icons/logo-full.svg"}
            className=" mb-12 h-10 w-auto"
          />
          <RegisterForm user={user} />
            <small className=" py-6 justify-items-end text-dark-600 lg:text-left">
              {new Date().getFullYear()} &copy; Care Plus
            </small>
         
        </div>
      </section>
      {/* right side cover image  */}
      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt="cover-photo"
        className=" max-w-[390px] side-img"
      />
    </div>
  );
};

export default PatientRegisterPage;
