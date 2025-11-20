import type { Metadata } from "next";
import { FormContextProvider } from "@/contexts/form-context";
import Form from "./components/form";

export const metadata: Metadata = {
  title: "Submit a Request | MOC Request Platform",
  description: "Complete the 5W1H submission form to request support from the Ministry of Culture.",
};

export default function SubmitPage() {
  return (
    <FormContextProvider>
      <Form/>
    </FormContextProvider>
  );
}