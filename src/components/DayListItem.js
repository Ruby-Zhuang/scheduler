import React from "react";
import classnames from 'classnames';
import "components/DayListItem.scss";

export default function DayListItem(props) {
  // Use classnames library to help compose the list of classes
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{props.spots}</h3>
    </li>
  );
}