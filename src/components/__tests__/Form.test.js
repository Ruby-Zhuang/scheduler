import React from 'react';

import { render, fireEvent, cleanup } from '@testing-library/react';

import Form from 'components/Appointment/Form';

afterEach(cleanup);

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
  ];

  it('renders without student name if not provided', () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText('Enter Student Name')).toHaveValue(''); // One way to access student name input
  });

  it('renders with initial student name', () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />
    );
    expect(getByTestId('student-name-input')).toHaveValue('Lydia Miller-Jones'); // Another way to access student name input
  });

  it('validates that the student name is not blank', () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();
    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the name prop should be blank or undefined */
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText('Save'));

    /* 4. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    /* 5. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();
  });

  it('can successfully save after trying to submit an empty student name', () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();
    /* 2. Render the Form with interviewers, name and the onSave mock function passed as an onSave prop */
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText('Save'));

    /* 4. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    /* 5. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();

    /* 6. Trigger the onChange event for the input field */
    fireEvent.change(getByPlaceholderText('Enter Student Name'), {
      target: { value: 'Lydia Miller-Jones' },
    });

    /* 7. Click the save button */
    fireEvent.click(getByText('Save'));

    /* 8. validation is not shown */
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    /* 9. onSave is called once */
    expect(onSave).toHaveBeenCalledTimes(1);
    /* 10. onSave is called with the correct arguments */
    expect(onSave).toHaveBeenCalledWith('Lydia Miller-Jones', null);
  });

  it('calls onCancel and resets the input field', () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(getByText('Save'));

    fireEvent.change(getByPlaceholderText('Enter Student Name'), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByText('Cancel'));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(getByPlaceholderText('Enter Student Name')).toHaveValue('');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
