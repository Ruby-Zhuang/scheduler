import classNames from 'classnames';
import 'components/InterviewerListItem.scss';

interface InterviewerListItemProps {
  name: string;
  avatar: string;
  selected: boolean;
  setInterviewer: () => void;
}
export default function InterviewerListItem(props: InterviewerListItemProps) {
  // Use classnames library to help compose the list of classes
  const interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
