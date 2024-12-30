"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";

type AppointmentProps = {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
}

export const AppointmentForm = ({ userId, patientId, type }: AppointmentProps ) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  let buttonLabel;

  switch (type) {
    case 'cancel':
        buttonLabel = 'Cancel Appointment';
        break;
    
    case 'create':
        buttonLabel = 'Create Appointment';
        break;
    
    case 'schedule':
        buttonLabel = 'Schedule Appointment';
        break;
    
    default:
        break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
        </section>

        {type !== "cancel" && (
            <>
               <CustomFormField
                 fieldType={FormFieldType.SELECT}
                 control={form.control}
                 name="primaryPhysician"
                 label="Doctor"
                 placeholder="Select a doctor"
               >
                   {Doctors.map((doctor) => (
                       <SelectItem key={doctor.name} value={doctor.name}>
                           <div className="flex cursor-pointer items-center gap-2">
                               <Image
                                  src={doctor.image}
                                  width={32}
                                  height={32}
                                  alt={doctor.name}
                                  className="rounded-full border border-dark-500" 
                               />
                               <p>{doctor.name}</p>
                           </div>
                       </SelectItem>
                   ))}
               </CustomFormField>

               <div className="flex flex-col gap-6 xl:flex-row">
                   <CustomFormField
                       fieldType={FormFieldType.TEXTAREA}
                       control={form.control}
                       name="reason"
                       label="Reason for appointment"
                       placeholder="ex:Annual monthly check-up"
                   />
                   <CustomFormField
                       fieldType={FormFieldType.TEXTAREA}
                       control={form.control}
                       name="notes"
                       label="Additional comments / notes"
                       placeholder="ex:Prefer afternoon appointments. If possible"
                   />
               </div>

               <CustomFormField
                   fieldType={FormFieldType.DATE_PICKER}
                   control={form.control}
                   name="schedule"
                   label="Expected apointment date"
                   placeholder="Select your appointment date"
                   showTimeSelect
                   dateFormat="MM/dd/yyyy - h:mm aa"
               />
            </>
        )}

        {type === "cancel" && (
            <CustomFormField
               fieldType={FormFieldType.TEXTAREA}
               control={form.control}
               name="cancellationReson"
               label="Reason for cancellation"
               placeholder="ex:Urgent meeting came up"
            />
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  );
};