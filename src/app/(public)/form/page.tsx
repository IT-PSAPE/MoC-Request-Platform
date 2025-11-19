import type { Metadata } from "next";
import { FormContextProvider } from "@/contexts/form-context";
import Form from "./components/form";

export const metadata: Metadata = {
  title: "Submit a Request | MOC Request Platform",
  description: "Share the details of your Ministry of Culture support request using the guided 5W1H form so the team can respond quickly.",
};

export default function SubmitPage() {
  return (
    <FormContextProvider>
      <Form/>
    </FormContextProvider>
  );
}
