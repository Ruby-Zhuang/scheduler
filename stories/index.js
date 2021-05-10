import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import "index.scss";

///////////////////////////////////////////////////////////////////////////////
// IMPORT COMPONENTS ----------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////

import Button from "components/Button";
import DayListItem from "components/DayListItem";

///////////////////////////////////////////////////////////////////////////////
// BUTTON STORIES -------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
storiesOf("Button", module) //Initiates Storybook and registers component
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  }) // Provides the default background color for our component
  .add("Base", () => <Button>Base</Button>) // To define our stories, we call add() once for each of our test states to generate a story
  .add("Confirm", () => <Button confirm>Confirm</Button>)
  .add("Danger", () => <Button danger>Cancel</Button>)
  .add("Clickable", () => (
    <Button onClick={action("button-clicked")}>Clickable</Button> // action() allows us to create a callback that appears in the actions panel when clicked
  ))
  .add("Disabled", () => (
    <Button disabled onClick={action("button-clicked")}>
      Disabled
    </Button>
  ));

///////////////////////////////////////////////////////////////////////////////
// DAYLISTITEM STORIES --------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
storiesOf("DayListItem", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  })
  .add("Unselected", () => <DayListItem name="Monday" spots={5} />)
  .add("Selected", () => <DayListItem name="Monday" spots={5} selected />) 
  .add("Full", () => <DayListItem name="Monday" spots={0} />)
  .add("Clickable", () => (
    <DayListItem name="Tuesday" setDay={action("setDay")} spots={5} />
  ));