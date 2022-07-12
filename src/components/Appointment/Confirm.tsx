import Button from 'components/Button';

interface ConfirmProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// Confirm component allows a user to confirm a destructive action
export default function Confirm(props: ConfirmProps) {
  const { message, onCancel, onConfirm } = props;

  return (
    <main className="appointment__card appointment__card--confirm">
      <h1 className="text--semi-bold">{message}</h1>
      <section className="appointment__actions">
        <Button danger onClick={onCancel}>
          Cancel
        </Button>
        <Button danger onClick={onConfirm}>
          Confirm
        </Button>
      </section>
    </main>
  );
}
