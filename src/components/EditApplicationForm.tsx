import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useUpdateApplication } from "#/hooks/use-application.ts";
import {
  baseSchema,
  jobSources,
  jobStatuses,
  type UpdateApplication,
  updateApplicationSchema,
} from "#/lib/schemas/application.ts";
import type { Application } from "#/types/applications.ts";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent } from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface EditApplicationFormProps {
  application: Application;
}

export function EditApplicationForm({ application }: EditApplicationFormProps) {
  const updateApplication = useUpdateApplication(application.id);

  const defaultValues: z.infer<typeof updateApplicationSchema> = {
    companyName: application.companyName,
    roleTitle: application.roleTitle,
    appliedDate: application.appliedDate ?? null,
    jobUrl: application.jobUrl,
    notes: application.notes,
    salary: application.salary,
    source: application.source,
    status: application.status,
  };

  // console.log(defaultValues);
  // console.log(application);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updateApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: z.infer<typeof updateApplicationSchema> = {
        ...value,
        salary: value.salary || null,
        jobUrl: value.jobUrl || null,
        source: (value.source as UpdateApplication["source"]) || null,
        notes: value.notes || null,
        appliedDate: value.appliedDate ? new Date(value.appliedDate) : null,
      };
      updateApplication.mutate(payload);
    },
  });

  return (
    <div className="max-w-[60ch] mx-auto w-full">
      <Card>
        <CardContent>
          <form>
            <FieldSet>
              <FieldLegend>Job Applications</FieldLegend>
              <FieldDescription>
                Edit your job application entry
              </FieldDescription>
              <FieldGroup>
                <form.Field
                  name="companyName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Company Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                ></form.Field>
                <form.Field
                  name="roleTitle"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Role Title</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                ></form.Field>
                <form.Field
                  name="status"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobStatuses.map((jobStatus) => (
                              <SelectItem key={jobStatus} value={jobStatus}>
                                {jobStatus}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="salary"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Salary</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="jobUrl"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Job URL</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="source"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Source</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobSources.map((jobSource) => (
                              <SelectItem key={jobSource} value={jobSource}>
                                {jobSource}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="notes"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <Field>
                  <FieldLabel>Applied Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Pick a date...</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                  <FieldDescription>Insert a description here</FieldDescription>
                  <FieldError>Insert error message here</FieldError>
                </Field>
                <Field>
                  <Button>Submit</Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
