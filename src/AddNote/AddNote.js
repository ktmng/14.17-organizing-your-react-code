import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from "../config"
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
      validationMessage: ''
    };
  }
  static contextType = ApiContext;
  static defaultProps = {
    folders: []
  };

  isNameValid = event => {
    event.preventDefault();
    if (!this.state.name) {
      this.setState({
        validationMessage: 'Note name is required',
        nameValid: false
      });
    } else if (!this.state.id) {
      this.setState({
        validationMessage: 'Please choose an existing folder',
        idValid: false
      });
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
  };

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
  };

  render() {
    return (
      <section className='AddNote'>
        <h2>Add a New Note</h2>
        <NotefulForm
          onSubmit={event => {
            this.isNameValid(event);
          }}
        >
          <div className='field'>
            <label htmlFor='note-name-input'>Note Name</label>
            <input
              type='text'
              id='note-name-input'
              name='note'
              onChange={event => {
                this.nameChange(event.target.value);
              }}
            />
          </div>
          {!this.state.nameValid && (
            <div>
              <p>{this.state.validationMessage}</p>
            </div>
          )}
          <div className='field'>
            <label htmlFor='note-content-input'>Content</label>
            <textarea
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
            {!this.state.nameValid && (
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