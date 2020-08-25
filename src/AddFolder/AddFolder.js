import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types'
import './AddFolder.css';

export default class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      name: '',
      id: '',
      nameValid: false,
      validationMessage: null
    };
  }
  static contextType = ApiContext;
  static defaultProps = {
    history: {
      goBack: () => { }
    }
  };

  handleAddFolderForm = (event) => {
  let isNameValid = () => {
    event.preventDefault();
    if (!this.state.name) {
      this.setState({
        validationMessage: 'Folder name is required',
        nameValid: false
      });
    } else {
      this.setState(
        {
          validationMessage: '',
          nameValid: true
        },
        this.addFolder()
      );
    }
  };

  let returnBack = () => {this.props.history.goBack()}

  isNameValid(event);
  if (this.state.validationMessage !== null) {
    returnBack();
  } 
  } //End of handleAddFolderForm

  addFolder = () => {
    const randomid =
      Math.random().toString(36).substring(2, 4) +
      Math.random().toString(36).substring(2, 4);
    console.log(randomid);

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        id: randomid,
      })
    };
    console.log(options);

    fetch(`${config.API_ENDPOINT}/folders`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.context.addFolder(data);
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  };

  nameChange = input => {
    this.setState({ name: input });
  };

  render() {
    return (
      <section className='AddFolder'>
        <h2>Add a New Folder</h2>
        <NotefulForm
          onSubmit={event => {
            this.handleAddFolderForm(event);
          }}
        >
          <div className='add-folder-form'>
            <label htmlFor='folder-name-input'>Folder Name</label>
            <input
              type='text'
              id='folder-name-input'
              name='folder'
              onChange={event => this.nameChange(event.target.value)}
            />
            {!this.state.nameValid && (
              <div className='validation-msg'>
                <p>{this.state.validationMessage}</p>
              </div>
            )}
          </div>
          <div className='buttons'>
            <button type='submit'>Add</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

AddFolder.propTypes = {
  history: PropTypes.object,
  nameChange: PropTypes.func.isRequired,
  handleAddFolderForm: PropTypes.func.isRequired
}