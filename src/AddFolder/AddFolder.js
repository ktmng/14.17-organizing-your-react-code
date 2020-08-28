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
  returnBack = () => {this.props.history.goBack()}
  handleError = () => {
    if (this.state.validationMessage !== null && this.state.name.length !== 0) {
      this.returnBack();
    }
  }
  handleAddFolderForm = (event) => {
    event.preventDefault();
    if (!this.state.name) {
      this.setState({
        validationMessage: 'Folder name is required',
        nameValid: false
      },()=>{this.handleError()});
    } else {
      this.setState(
        {
          validationMessage: '',
          nameValid: true
        },
        ()=>this.addFolder()
      )
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
//new: error handling
    if (this.state.error) {
      return (
        <h2 className='error-msg'>
          Caught An Error: {this.state.error}
        </h2>
      )
    }
//new: error handling
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
  history: PropTypes.object
}