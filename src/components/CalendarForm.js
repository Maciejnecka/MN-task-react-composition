import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Api from '../providers/calendarProvider';

class CalendarForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      date: '',
      time: '',
      errors: {},
      firstNameSuggestions: [],
      lastNameSuggestions: [],
      emailSuggestions: [],
    };
    this.api = new Api();
  }

  handleInputChange = async (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    if (name === 'firstName' || name === 'lastName' || name === 'email') {
      try {
        const suggestions = await this.api.filter(name, value);
        this.setState({ [`${name}Suggestions`]: suggestions });
      } catch (error) {
        console.error('Error fetching suggestions: ', error);
      }
    }
  };

  handleSuggestionClick = (name, suggestion) => {
    this.setState({ [name]: suggestion, [`${name}Suggestions`]: [] });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length === 0) {
      const id = uuidv4();
      const newMeeting = {
        id,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        date: this.state.date,
        time: this.state.time,
      };

      this.props.onSubmit(newMeeting);

      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        time: '',
        errors: {},
      });
    } else {
      this.setState({ errors });
    }
  };

  validateForm = () => {
    const errors = {};
    const fields = [
      {
        name: 'firstName',
        label: 'First name',
        required: true,
        minLength: 2,
      },
      {
        name: 'lastName',
        label: 'Last name',
        required: true,
        minLength: 2,
      },
      {
        name: 'email',
        label: 'Email',
        required: true,
        pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      },
      {
        name: 'date',
        label: 'Date',
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/,
      },
      {
        name: 'time',
        label: 'Time',
        required: true,
        pattern: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },
    ];

    fields.forEach((field) => {
      const value = this.state[field.name];

      if (field.required && value.trim() === '') {
        errors[field.name] = `${field.label} is required.`;
      }

      if (field.minLength && value.length < field.minLength) {
        errors[
          field.name
        ] = `${field.label} should be at least ${field.minLength} characters long.`;
      }

      if (field.pattern && !new RegExp(field.pattern).test(value)) {
        errors[field.name] = `${field.label} is not in the correct format.`;
      }
    });
    return errors;
  };

  render() {
    return (
      <div className="form">
        <h1 className="form__title">Meeting Form</h1>
        <form className="form__container" onSubmit={this.handleSubmit}>
          <label className="form__label">
            <input
              placeholder="First name"
              className="form__input"
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleInputChange}
              list="firstNameSuggestions"
            />
            <datalist id="firstNameSuggestions">
              {this.state.firstNameSuggestions.map((suggestion) => (
                <option
                  key={suggestion.id}
                  value={suggestion.firstName}
                  onClick={() =>
                    this.handleSuggestionClick(
                      'firstName',
                      suggestion.firstName
                    )
                  }
                />
              ))}
            </datalist>
            {this.state.errors.firstName && (
              <p className="form__error">{this.state.errors.firstName}</p>
            )}
          </label>
          <label className="form__label">
            <input
              placeholder="Last name"
              className="form__input"
              type="text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleInputChange}
              list="lastNameSuggestions"
            />
            <datalist id="lastNameSuggestions">
              {this.state.lastNameSuggestions.map((suggestion) => (
                <option
                  key={suggestion.id}
                  value={suggestion.lastName}
                  onClick={() =>
                    this.handleSuggestionClick('lastName', suggestion.lastName)
                  }
                />
              ))}
            </datalist>
            {this.state.errors.lastName && (
              <p className="form__error">{this.state.errors.lastName}</p>
            )}
          </label>
          <label className="form__label">
            <input
              placeholder="Email"
              className="form__input"
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
              list="emailSuggestions"
            />
            <datalist id="emailSuggestions">
              {this.state.emailSuggestions.map((suggestion) => (
                <option
                  key={suggestion.id}
                  value={suggestion.email}
                  onClick={() =>
                    this.handleSuggestionClick('email', suggestion.email)
                  }
                />
              ))}
            </datalist>
            {this.state.errors.email && (
              <p className="form__error">{this.state.errors.email}</p>
            )}
          </label>
          <label className="form__label">
            <input
              className="form__input"
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleInputChange}
            />
            {this.state.errors.date && (
              <p className="form__error">{this.state.errors.date}</p>
            )}
          </label>
          <label className="form__label">
            <input
              className="form__input"
              type="time"
              name="time"
              value={this.state.time}
              onChange={this.handleInputChange}
            />
            {this.state.errors.time && (
              <p className="form__error">{this.state.errors.time}</p>
            )}
          </label>
          <button className="form__button" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}
export default CalendarForm;
