"use server";
import { ID, Query } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENTS_COLLECTION_ID!,
      ID.unique(),
      { ...appointment }
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENTS_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENTS_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
          case "pending":
            acc.pendingCount++;
          case "cancelled":
            acc.cancelledCount++;

            break;
        }
        return acc;
      },
      initialCounts
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};
