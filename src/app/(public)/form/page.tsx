import { FormContextProvider } from "@/contexts/form-context";
import Form from "./components/form";

export default function SubmitPage() {
  return (
    <FormContextProvider>
      <Form/>
    </FormContextProvider>
  );
}