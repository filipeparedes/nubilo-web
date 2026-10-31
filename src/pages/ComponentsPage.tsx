import { useState } from "react";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { Modal } from "../components/Modal";
import { RuleTitle } from "../components/RuleTitle";
import { StatusLine } from "../components/Statusline";
import { Wordmark } from "../components/Wordmark";

// Development-only sandbox: put components here to see how they look.
export default function ComponentsPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex flex-col gap-6 p-10">
      <Button className="self-start" onClick={() => setOpen(true)}>
        open modal
      </Button>
      <RuleTitle title="button" />
      <Field label="test field" />

      {open && (
        <Modal
          title="delete file"
          size="sm"
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>confirm</Button>}
        >
          Are you sure?
        </Modal>
      )}

      <StatusLine tone="success">file uploaded</StatusLine>

      <Wordmark size="md"/>
      <Wordmark size="lg"/>
      <Wordmark size="lg" cursor={false} />
    </main>
  );
}