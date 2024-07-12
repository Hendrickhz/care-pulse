"use server";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { databases, storage, users } from "@/lib/appwrite.config";
import { InputFile } from "node-appwrite/file";
export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}


export const createUser = async (user: CreateUserParams) => {
  try {

    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);
      console.log("Existing user found:", existingUser.users[0]);
      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

//get authenticated user
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );
      file = await storage.createFile(
        process.env.NEXT_PUBLIC_BUCKET_ID!,
        ID.unique(),
        inputFile
      );
    }
    const newPatient = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_PATIENTS_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${process.env
          .NExT_PUBLIC_ENDPOINT!}/storage/buckets/${process.env
          .NEXT_PUBLIC_BUCKET_ID!}/files/${file?.$id}/view?project=${
          process.env.NEXT_PUBLIC_PROJECT_ID
        }`,
        ...patient,
      }
    );
    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};

//get patient by userId
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_PATIENTS_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
