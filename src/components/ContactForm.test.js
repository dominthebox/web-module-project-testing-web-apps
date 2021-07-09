import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';



test('renders without errors', ()=>{
    // Arrange
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    // Arrange
    render(<ContactForm />);
    // Act
    const header = screen.getByText(/contact form/i)
    // Assert
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    // Arrange
    render(<ContactForm />)
    // Act
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "dom")

    const firstNameError = await screen.findAllByTestId('error');
    // Assert
    expect(firstNameError).toHaveLength(1);
    
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    // Arrange
    render(<ContactForm />);
    // Act
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorFields = await screen.findAllByTestId('error');
    // Assert
    expect(errorFields).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "Dominick");
    
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "Sallustro");

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const emailError =  await screen.findAllByTestId('error');
    expect(emailError).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "google mail");

    const emailError =  await screen.findByText(/email must be a valid email address/i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const lastNameError = await screen.findByText(/lastName is a required field/i);
    expect(lastNameError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "Jimmy");
    
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "John");

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "jimmyJ@yahoo.com");

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("Jimmy");
        const lastNameDisplay = screen.queryByText("John");
        const emailDisplay = screen.queryByText("jimmyJ@yahoo.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

// test('renders all fields text when all fields are submitted.', async () => {
    
// });