interface HeaderProps {
  time: string;
}

// Header component displays the time for the appointment
export default function Header(props: HeaderProps) {
  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.time}</h4>
      <hr className="appointment__separator" />
    </header>
  );
}
