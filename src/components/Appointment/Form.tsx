import { useState } from 'react';
import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList';

interface FormProps {
  name?: string;
  interviewer?: number;
  interviewers: Interviewer[];
  onCancel: () => void;
  onSave: (name: string, interviewer: number) => void;
}
/*
 * Form component keeps track of the current text input value and the currently selected interviewer
 * Allows user to input their information, save it and edit it
 */
export default function Form(props: FormProps) {
  // Add state and set default values
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('');

  // Clear and reset the form values
  const reset = () => {
    setName('');
    setInterviewer(null);
  };

  // Handle cancel
  const cancel = () => {
    reset();
    props.onCancel();
  };

  // Validate input
  function validate() {
    if (name === '') {
      setError('Student name cannot be blank');
      return;
    }

    if (interviewer === null) {
      setError('An interviewer must be selected');
      return;
    }

    setError('');
    props.onSave(name, interviewer);
  }

  // Form component
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name} // Current name
            onChange={(event) => setName(event.target.value)} // Update input with current text
            data-testid="student-name-input"
            /*
              This must be a controlled component
            */
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer} // Current id of interviewer
          onChange={setInterviewer} // Function to update selected interviewer
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
