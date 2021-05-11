import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

/* 
 * Form component keeps track of the current text input value and the currently selected interviewer
 * Allows user to input their information, save it and edit it
 */
export default function Form(props) {
  // Add state and set default values
  const [ name, setName ] = useState(props.name || "");
  const [ interviewer, setInterviewer ] = useState(props.interviewer || null);
  
  // Deconstruct remaining props
  const {interviewers, onSave, onCancel } = props;

  // Clear and reset the form values
  const reset = () => {
    setName('');
    setInterviewer(null);
  };

  // Handle cancel
  const cancel = () => {
    reset();
    onCancel();
  };

  // Form component
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name} // Current name
            onChange={(event) => setName(event.target.value)} // Update input with current text
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList 
          interviewers={interviewers} 
          value={interviewer} // Current id of interviewer
          onChange={setInterviewer} // Function to update selected interviewer
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => onSave(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );
}