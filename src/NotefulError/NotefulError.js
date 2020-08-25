import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NotefulError extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        hasError: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>An error occurred. Could not display this content.</h2>;
    }
    return this.props.children;
  }
}

export default NotefulError;

NotefulError.propTypes = {
  children: PropTypes.element.isRequired
}