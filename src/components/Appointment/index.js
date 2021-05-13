import React from "react";
import useVisualMode from "hooks/useVisualMode";

import "./styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props){
  // use useVisualMode Hook and initialize mode to either SHOW or EMPTY if there's an interview
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={[]}
          onSave={() => console.log("Clicked onSave")}
          onCancel={() => console.log("Clicked onCancel")}
        />
      )}
    </article>
  );
}