import React from "react";

import "components/Button.scss";

export default function Button(props) {
  // Conditionally apply CSS depending on props by building up className string
  let buttonClass = "button";

  if (props.confirm) {
    buttonClass += " button--confirm";
  }

  if (props.danger) {
    buttonClass += " button--danger";
  }

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}   // Adding interactivity
      disabled={props.disabled} // Adding interactivity (when a button is disabled it should not fire click events)
    >
      {/* Variable button text */}
      {props.children}
    </button>
  );
}