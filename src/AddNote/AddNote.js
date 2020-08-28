import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from "../config"
import PropTypes from 'prop-types'
import './AddNote.css';

export default class AddNote extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      name: '',
      content: '',
      id: '',
      nameValid: false,
      idValid: false,
      contentValid: false,
      validationMessage: null
    };
//new: trying to get add note to accurately update onchange's value
    this.nameChange = this.nameChange.bind(this);
    this.contentChange = this.contentChange.bind(this);
    this.folderIdChange = this.folderIdChange.bind(this);
    this.handleAddNoteForm = this.handleAddNoteForm.bind(this);
//new
  }
  static contextType = ApiContext;
  static defaultProps = {
    folders: [],
    history: {
      goBack: () => { }
    }
  };

  handleError = () => {
    console.log(this.state)
    if (this.state.validationMessage == null) {
      this.returnBack();
    }
  }
  handleAddNoteForm = (event) => {
    event.preventDefault();
    if (!this.state.name) {
      this.setState({
        validationMessage: 'Note name is required',
        nameValid: false
      }, ()=> {this.handleError()})
    } else if (!this.state.content) {
      this.setState({
        validationMessage: 'Note contents cannot be left blank',
        contentValid: false
      }, () => {this.handleError()})
    } else if (!this.state.id || this.state.id === '...') {
      this.setState({
        validationMessage: 'Please choose an existing folder',
        idValid: false
      }, () => {this.handleError()})
    } else {
      this.setState(
        {
          validationMessage: '',
          nameValid: true
        },
        () => {
          this.addNote();
        }
      );
    } 
  } // End of handleAddNoteForm

  returnBack = () => {this.props.history.goBack()}

  addNote = () => {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        modified: new Date(),
        folderId: this.state.id,
        content: this.state.content
      })
    };

    fetch(`${config.API_ENDPOINT}/notes`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.context.addNote(data);
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  };

  nameChange = input => {
    this.setState({ name: input });
  };

  contentChange = input => {
    this.setState({ content: input });
  };

  folderIdChange = input => {
    this.setState({ id: input });
    console.log(input);
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
      <section className='AddNote'>
        <h2>Add a New Note</h2>
        <NotefulForm
          onSubmit={event => {
            this.handleAddNoteForm(event);
          }}
        >
          <div className='field'>
            <label htmlFor='note-name-input'>Note Name</label>
            <input
              // required
              type='text'
              id='note-name-input'
              name='note'
              onChange={event => {
                this.nameChange(event.target.value);
              }}
            />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>Content</label>
            <textarea
              // required
              id='note-content-input'
              name='content'
              onChange={event => {
                this.contentChange(event.target.value);
              }}
            />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>Folder</label>
            <select
              id='note-folder-select'
              name='folder'
              onChange={event => {
                this.folderIdChange(event.target.value);
              }}
            >
              <option value={null}>...</option>
              {this.context.folders.map(folder => (
                <option key={folder.name} name='folder' value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            {this.state.validationMessage && (
              <div>
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

AddNote.propTypes = {
  folder: PropTypes.array,
  history: PropTypes.object
}