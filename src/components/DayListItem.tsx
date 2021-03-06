import classNames from 'classnames';
import 'components/DayListItem.scss';

interface DayListItemProps {
  name: WeekDay;
  spots: number;
  selected: boolean;
  setDay: (name: WeekDay) => void;
}

export default function DayListItem(props: DayListItemProps) {
  // Use classnames library to help compose the list of classes
  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0,
  });

  // Format spots text depending on number of spots left
  const formatSpots = function () {
    const spotsRemaining = props.spots;

    if (spotsRemaining) {
      return spotsRemaining === 1
        ? `1 spot remaining`
        : `${spotsRemaining} spots remaining`;
    } else {
      return `no spots remaining`;
    }
  };

  return (
    <li
      className={dayClass}
      data-testid="day"
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}
