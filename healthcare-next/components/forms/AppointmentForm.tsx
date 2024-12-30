"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Values, z } from "zod";

import { Form } from "@/components/ui/form";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { getAppointmentSchema } from "@/lib/validation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.actions";

type AppointmentProps = {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
}

export const AppointmentForm = ({ userId, patientId, type }: AppointmentProps ) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
        case 'schedule':
            status = 'scheduled';
            break;
        
        case 'cancel' :
            status = 'cancelled'
            break;

        default:
            status = 'pending'
            break;
    }

    try {
        if(type === 'create' && patientId) {
            const appointmentData = {
               userId,
               patient: patientId,
               primaryPhysician: values.primaryPhysician,
               schedule: new Date(values.schedule),
               reason: values.reason!,
               status: status as Status,
               note: values.note,
            }    
            
            const appointment = await createAppointment(appointmentData);

            if(appointment) {
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
            }
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
                       name="note"
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