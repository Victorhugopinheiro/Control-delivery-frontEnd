import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"



const schemaWorker = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    pricePerPackage: z.number().min(0, { message: "Price per package must be greater than or equal to 0" }),
    phone: z.string().min(1, { message: "Phone is required" }),
})


export type WorkerType = z.infer<typeof schemaWorker>


export function WorkerForm() {
    return useForm<WorkerType>({
        resolver: zodResolver(schemaWorker),
        defaultValues: {
            name: "",
            pricePerPackage: 0,
            phone: "",
        },
    })
}