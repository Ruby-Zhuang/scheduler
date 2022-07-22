import DayListItem from 'components/DayListItem';

interface DayListProps {
  days: Day[];
  day: WeekDay;
  setDay: (day: WeekDay) => void; // QUESTION: seems like there's no arguments but still have to declare if it's from parents? When passing something down through props, do you have to type cast it for each component?
}

// Component that holds multiple days
export default function DayList(props: DayListProps) {
  // Map over the days array of objects to return <DayListItem /> components
  const daysData = props.days; // Array of day objects [{}]
  const daysList = daysData.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day} // Check to see if the day that is selected matches the name in the props (this avoids passing the currently selected day to each DayListItem)
        setDay={props.setDay}
      />
    );
  });

  // DayList component should return a single <ul></ul> element with <DayListItem /> components as children
  return <ul>{daysList}</ul>;
}
