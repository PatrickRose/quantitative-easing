import React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import Form, {FormFields} from './Form';

const fields: FormFields = {
    foo: {
        caption: 'Test form field',
    },
    bar: {
        caption: 'Second form field',
    }
}

const submitCaption = "Submit caption";

const nullSubmit = () => true

it('renders without crashing', () => {
    const tree = renderer
      .create(<Form fields={fields} submit={nullSubmit} submitCaption={submitCaption} overrideID='test' />)
      .toJSON();
    expect(tree).toMatchSnapshot();
});

it('triggers validation', async () => {
    const validationMsg = 'failed validation';
    const validator = jest.fn(() => validationMsg);
    const fieldValidation: FormFields = {
       foo: {
           caption: 'Always fails validation',
           validator: validator,
       }
   }
    render(<Form fields={fieldValidation} submit={nullSubmit} submitCaption={submitCaption} />);

    fireEvent.click(screen.getByRole('button'))

    expect(validator).toHaveBeenCalled();

    await waitFor(() => screen.findByText(RegExp(validationMsg, 'i')))

    const inputEl = expect(screen.getByLabelText(/Always fails validation/i));
    inputEl.toHaveAttribute('aria-invalid', 'true');
    inputEl.toHaveAttribute('aria-errormessage');

});
