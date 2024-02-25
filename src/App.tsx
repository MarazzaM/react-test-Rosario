import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import './index.css'

const items = [
  {
    id: "India",
    label: "India",
  },
  {
    id: "USA",
    label: "USA",
  },
  {
    id: "France",
    label: "France",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
});

export default function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["India"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submittedValues = JSON.stringify(data, null, 2);
    alert(`Form submitted with values:\n\n${submittedValues}`);
  }

  function handleSelectAll(checked: boolean) {
    const updatedItems = checked ? items.map((item) => item.id) : [];
    form.setValue("items", updatedItems);
  }

  function handleCheckboxChange(id: string, checked: boolean) {
    let updatedItems;
    if (checked) {
      updatedItems = [...form.getValues("items"), id];
    } else {
      updatedItems = form.getValues("items").filter((value) => value !== id);
    }
    form.setValue("items", updatedItems);
  }

  return (
    <div className="container">
    <form onSubmit={form.handleSubmit(onSubmit)} className="form">
      <div className="mb-4">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="selectAll"
            name="selectAll"
            checked={form.watch("items").length === items.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <label htmlFor="selectAll" className="label">
            Select All
          </label>
        </div>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="checkbox-container"
        >
          <input
            type="checkbox"
            id={item.id}
            name="items"
            value={item.id}
            checked={form.watch("items").includes(item.id)}
            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
          />
          <label htmlFor={item.id} className="label">
            {item.label}
          </label>
        </div>
      ))}
      {form.formState.errors.items && (
        <p className="error">{form.formState.errors.items.message}</p>
      )}
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  </div>
  );
}
