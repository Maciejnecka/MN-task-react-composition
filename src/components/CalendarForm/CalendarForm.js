import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Api from '../../providers/calendarProvider';
import CalendarFormRender from './CalendarFormRender';
import { validateFormFields } from '../../helpers/ValidateForm';
import { renderFormFields } from '../utilis/formUtilis';

class CalendarForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        time: '',
      },
      errors: {},
      touched: {},
      suggestions: {
        firstNameSuggestions: [],
        lastNameSuggestions: [],
        emailSuggestions: [],
      },
    };
    this.api = new Api();
  }
  handleInputChange = async (e) => {
    const { name, value } = e.target;

    this.setState(
      (prevState) => ({
        form: {
          ...prevState.form,
          [name]: value,
        },
        touched: {
          ...prevState.touched,
          [name]: true,
        },
      }),
      () => {
        const errors = this.validateForm();
        this.setState({ errors });
        if (!errors[name]) {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              [name]: undefined,
            },
          }));
        }
        const correctNames = ['firstName', 'lastName', 'email'];
        if (correctNames.includes(name)) {
          this.api
            .filter(name, value)
            .then((suggestions) => {
              this.setState((prevState) => ({
                suggestions: {
                  ...prevState.suggestions,
                  [`${name}Suggestions`]: suggestions,
                },
              }));
            })
            .catch((error) => {
              console.error('Error fetching suggestions: ', error);
            });
        }
      }
    );
  };

  handleSuggestionClick = (name, suggestion) => {
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: suggestion,
      },
      suggestions: {
        ...prevState.suggestions,
        [`${name}Suggestions`]: [],
      },
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length === 0) {
      const id = uuidv4();
      const newMeeting = {
        id,
        firstName: this.state.form.firstName,
        lastName: this.state.form.lastName,
        email: this.state.form.email,
        date: this.state.form.date,
        time: this.state.form.time,
      };

      this.props.onSubmit(newMeeting);

      this.setState({
        form: {
          firstName: '',
          lastName: '',
          email: '',
          date: '',
          time: '',
        },
        errors: {},
      });
    } else {
      this.setState({ errors });
    }
  };

  validateForm = () => {
    return validateFormFields(this.state);
  };

  render() {
    const { form, errors, suggestions, touched } = this.state;
    return (
      <CalendarFormRender
        form={form}
        errors={errors}
        suggestions={suggestions}
        handleInputChange={this.handleInputChange}
        handleSuggestionClick={this.handleSuggestionClick}
        handleSubmit={this.handleSubmit}
        renderFormFields={() => renderFormFields(form, errors, touched)}
      />
    );
  }
}
export default CalendarForm;
