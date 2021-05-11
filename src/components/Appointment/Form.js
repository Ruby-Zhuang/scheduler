import React from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

/* Form component keeps track of the current text input value and the currently selected interviewer
 * Allows user to input their information, save it and edit it
 */
export default function Form(props) {
  const { name, interviewers, interviewer, onSave, onCancel, setInterviewer } = props;

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={onCancel}>Cancel</Button>
          <Button confirm onClick={onSave}>Save</Button>
        </section>
      </section>
    </main>
  );
}