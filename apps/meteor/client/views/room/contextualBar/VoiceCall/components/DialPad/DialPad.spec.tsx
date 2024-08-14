/* eslint-disable testing-library/prefer-user-event */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import DialPad from './DialPad';

describe('DialPad', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should not be editable by default', () => {
		const fn = jest.fn();

		render(<DialPad value='' onChange={fn} />);

		expect(screen.getByLabelText('Phone_number')).toHaveAttribute('readOnly');
	});

	it('should enable input when editable', () => {
		const fn = jest.fn();

		render(<DialPad editable value='' onChange={fn} />);

		expect(screen.getByLabelText('Phone_number')).not.toHaveAttribute('readOnly');
	});

	it('should disable backspace button when input is empty', () => {
		const fn = jest.fn();

		render(<DialPad editable value='' onChange={fn} />);

		expect(screen.getByTestId('dial-paid-input-backspace')).toBeDisabled();
	});

	it('should enable backspace button when input has value', () => {
		const fn = jest.fn();

		render(<DialPad editable value='123' onChange={fn} />);

		expect(screen.getByTestId('dial-paid-input-backspace')).toBeEnabled();
	});

	it('should remove last character when backspace is clicked', () => {
		const fn = jest.fn();

		render(<DialPad editable value='123' onChange={fn} />);

		expect(screen.getByLabelText('Phone_number')).toHaveValue('123');

		screen.getByTestId('dial-paid-input-backspace').click();

		expect(fn).toHaveBeenCalledWith('12');
	});

	it('should call onChange when number is clicked', () => {
		const fn = jest.fn();

		render(<DialPad editable value='123' onChange={fn} />);

		['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach((digit) => {
			screen.getByTestId(`dial-pad-button-${digit}`).click();
			expect(fn).toHaveBeenCalledWith(`123${digit}`, digit);
		});
	});

	it('should call onChange with + when 0 pressed and held', () => {
		const fn = jest.fn();

		render(<DialPad editable longPress value='123' onChange={fn} />);

		const button = screen.getByTestId('dial-pad-button-0');

		button.click();
		expect(fn).toHaveBeenCalledWith('1230', '0');

		fireEvent.pointerDown(button);
		jest.runOnlyPendingTimers();
		fireEvent.pointerUp(button);

		expect(fn).toHaveBeenCalledWith('123+', '+');
	});
});