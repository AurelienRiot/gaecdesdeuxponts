"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import { useToastPromise } from "../ui/sonner";
import { bugReportSchema, type BugReportValues } from "./bug-report-schema";
import { createBugReport } from "./create-bug-report";

type BugReportModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const BugReportModal = ({ isOpen, setIsOpen }: BugReportModalProps) => {
  const { loading, toastServerAction } = useToastPromise({
    serverAction: createBugReport,
  });
  const url = decodeURI(window.location.href);

  const form = useForm<BugReportValues>({
    resolver: zodResolver(bugReportSchema),
    values: {
      subject: "RAPPORT DE BUG",
      page: url,
      message: "",
    },
  });

  const onSubmit = async (data: BugReportValues) => {
    setIsOpen(false);
    toastServerAction({
      data,
      onSuccess: () => form.reset({ page: url, subject: "RAPPORT DE BUG" }),
      onError: () => setIsOpen(true),
    });
  };

  return (
    <Modal
      title="Rapporter un bug"
      description="Décrivez le bug que vous avez rencontré"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="left-[50%] top-5 max-h-[90vh] translate-y-0 overflow-y-auto sm:top-[50%] sm:-translate-y-1/2"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem aria-hidden className="hidden">
                <FormControl>
                  <div className="flex items-start gap-x-4">
                    <Input {...field} disabled />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="page"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page</FormLabel>
                <FormControl>
                  <div className="flex items-start gap-x-4">
                    <Input
                      placeholder="..."
                      disabled={form.formState.isSubmitting || loading}
                      autoFocus={false}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du bug</FormLabel>
                <FormControl>
                  <div className="flex items-start gap-x-4">
                    <AutosizeTextarea
                      placeholder="..."
                      disabled={form.formState.isSubmitting || loading}
                      autoFocus={true}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center justify-between space-x-2 pt-6">
            <Button
              disabled={form.formState.isSubmitting || loading}
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              {"Annuler"}
            </Button>
            <FormButton disabled={loading} variant="default">
              {"Envoyer"}
            </FormButton>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default BugReportModal;
