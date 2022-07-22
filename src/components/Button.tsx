import classNames from 'classnames';
import 'components/Button.scss';

interface ButtonProps {
  confirm?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: string; // QUESTION: best way to handle children prop?
}

export default function Button(props: ButtonProps) {
  // Use classnames library to help compose the list of classes for the button
  const buttonClass = classNames('button', {
    'button--confirm': props.confirm, // Add confirm class if true
    'button--danger': props.danger, // Add danger class if true
  });

  return (
    <button
      className={buttonClass}
      onClick={props.onClick} // Add interactivity
      disabled={props.disabled} // Add interactivity (when a button is disabled it should not fire click events)
    >
      {/* Variable button text by rendering children prop as text */}
      {props.children}
    </button>
  );
}
