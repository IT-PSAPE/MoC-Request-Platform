import { FormContextProvider } from "./components/form-provider";
import Form from "./components/form";

export default function SubmitPage() {
  return (
    <FormContextProvider>
      <Form/>
    </FormContextProvider>
  );
}