"use client";
import { Step, StepContent, StepIcon, StepMeta, StepTitle, StepTrigger } from "@/components/ui/step";

export default function StepExample() {
  return (
    <div className="flex flex-col gap-1">
      <Step status="complete">
        <StepTrigger>
          <StepIcon />
          <StepTitle>Read the logs</StepTitle>
          <StepMeta>2s</StepMeta>
        </StepTrigger>
        <StepContent>
          <p>Three requests timed out after 30 seconds.</p>
        </StepContent>
      </Step>
      <Step status="running" defaultOpen>
        <StepTrigger>
          <StepIcon />
          <StepTitle>Add a retry with backoff</StepTitle>
        </StepTrigger>
        <StepContent>
          <p>Editing src/client.ts.</p>
        </StepContent>
      </Step>
    </div>
  );
}
