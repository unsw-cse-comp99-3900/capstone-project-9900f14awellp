import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from "vitest";
import { render_page } from "./test_functions";
import Sending from "@/views/sending";
import { Send } from "lucide-react";

describe('sending page unit test', () => {

  describe('left side of page', () => {
    test('title of Choice Invoice', () => {
      render_page(Sending, 'send');
      
      expect(screen.getByText(/Choice Invoice/i)).toBeInTheDocument();
    });

    test('Verification Success btn', () => {
      render_page(Sending, 'send');
  
      expect(screen.getByRole('button', {name: "Verification Success"})).toBeInTheDocument();
    });
  
    test('Verification Failed btn', () => {
      render_page(Sending, 'send');
  
      expect(screen.getByRole('button', {name: "Verification Failed"})).toBeInTheDocument();
    });
  
    test('Unvalidated btn', () => {
      render_page(Sending, 'send');
  
      expect(screen.getByRole('button', {name: "Unvalidated"})).toBeInTheDocument();
    });
  });
  
  describe('right side of page', () => {
    test('title of Sending To', () => {
      render_page(Sending, 'send');
      
      expect(screen.getByText(/Sending To/i)).toBeInTheDocument();
    });

    test('First Name input field', () => {
      render_page(Sending, 'send');

      expect(screen.getByRole('textbox', {name: "First Name"})).toBeInTheDocument();
    });

    test('Last Name input field', () => {
      render_page(Sending, 'send');

      expect(screen.getByRole('textbox', {name: "Last Name"})).toBeInTheDocument();
    });

    test('Email Address input field', () => {
      render_page(Sending, 'send');

      expect(screen.getByRole('textbox', {name: "Email Address"})).toBeInTheDocument();
    });
    test('Your Message input field', () => {
      render_page(Sending, 'send');

      expect(screen.getByRole('textbox', {name: "Your Message"})).toBeInTheDocument();
    });


    test('Clear btn', () => {
      render_page(Sending, 'send');
  
      expect(screen.getByRole('button', {name: "Clear"})).toBeInTheDocument();
    });

    test('Send btn', () => {
      render_page(Sending, 'send');
  
      expect(screen.getByRole('button', {name: "Send"})).toBeInTheDocument();
    });

  });
  

//   test('select Rules form', () => {
//     render_page(Sending, 'send');

//     expect(screen.getByTestId('select-Rules')).toBeInTheDocument();
//   });

//   test('select Invoice form', () => {
//     render_page(Sending, 'send');

//     expect(screen.getByTestId('select-Invoice')).toBeInTheDocument();
//   });

//   test('Validate button', () => {
//     render_page(Sending, 'send');

//     expect(screen.getByRole('button', {name: "Validate"})).toBeInTheDocument();
//   });
});