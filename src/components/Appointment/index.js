import React from "react";
import useVisualMode from "hooks/useVisualMode";

import "./styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props){
  // use useVisualMode Hook and initialize mode to either SHOW or EMPTY if there's an interview
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // Saving an interview -> show appointment once saved
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer // id of interviewer
    };

    transition(SAVING);
    // Calls function at Application component with appointment id and interview as arguments
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  // Deleting an interview -> slot becomes empty
  function destroy() {
    transition(DELETING, true); // Replace previous CONFIRM mode
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true)); // Replace previous DELETING mode
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {/* When user clicks on the add appointment button in EMPTY mode, it should transition to the CREATE mode. */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer} // Accepts interviewer object
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()} // Return to the EMPTY state when we click the cancel button.
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id} // Accepts interviewer id
          onSave={save}
          onCancel={() => back()} // Return to the EMPTY state when we click the cancel button.
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM &&     
        <Confirm
          message="Are you sure you want to delete?"
          onCancel={() => back()}
          onConfirm={destroy}
        />
      }
      {mode === ERROR_SAVE && 
        <Error
          message="Could not save appointment."
          onClose={() => back()}
        />
      }
      {mode === ERROR_DELETE && 
        <Error
          message="Could not delete appointment."
          onClose={() => back()}
        />
      }
    </article>
  );
}