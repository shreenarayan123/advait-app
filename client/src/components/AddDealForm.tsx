import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAddDeal } from "../hooks/useAddDeal";

const stageOptions = [
  { value: "LEAD", label: "Lead" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "CLOSED_WON", label: "Closed Won" },
  { value: "CLOSED_LOST", label: "Closed Lost" },
];

const formSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  amount: z.number().min(2, { message: "Amount must be positive" }),
    stage: z.string(),
});

export function AddDealForm({ customerId, onSuccess }: { customerId: string; onSuccess: () => void }) {
    const form = useForm<{ title: string; amount: number; stage: string }>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
      amount: 0,
      stage: "LEAD",
    },
  });
  const { addDeal, loading, error } = useAddDeal();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addDeal({ ...values, customerId });
      onSuccess();
    } catch {}
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Deal Title</FormLabel>
              <FormControl>
                <Input placeholder="Deal title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Amount" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stage"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Deal"}
        </Button>
      </form>
    </Form>
  );
} 