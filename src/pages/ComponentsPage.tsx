import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { RuleTitle } from "../components/RuleTitle";

// Development-only sandbox: put components here to see how they look.
export default function ComponentsPage() {
  return (
    <main className="flex flex-col gap-6 p-10">
      <Button>test</Button>
      <RuleTitle title="button"/>
      <Field label="test field"/>
    </main>
  );
}