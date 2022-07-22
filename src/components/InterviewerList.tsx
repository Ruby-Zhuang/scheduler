import InterviewerListItem from 'components/InterviewerListItem';

import 'components/InterviewerList.scss';

interface InterviewerListProps {
  value: number;
  interviewers: Interviewer[];
  onChange: (id: number) => void;
}

export default function InterviewerList(props: InterviewerListProps) {
  // Map over the interviewers array of objects to return <InterviewerListItem /> components
  const interviewersData = props.interviewers;
  const interviewersList = interviewersData.map((interviewer) => {
    const { id, name, avatar } = interviewer;

    return (
      <InterviewerListItem
        key={id}
        name={name}
        avatar={avatar}
        selected={id === props.value}
        setInterviewer={() => props.onChange(id)}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersList}</ul>
    </section>
  );
}
