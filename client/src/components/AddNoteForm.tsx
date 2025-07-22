import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useAddNote } from "../hooks/useAddNote";

const formSchema = z.object({
  content: z.string().min(2, { message: "Note cannot be empty" }),
});

export function AddNoteForm({ customerId, onSuccess }: { customerId: string; onSuccess: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const { addNote, loading, error } = useAddNote();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addNote({ ...values, type: "NOTE", customerId });
      onSuccess();
    } catch {}
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a note..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Note"}
        </Button>
      </form>
    </Form>
  );
} 