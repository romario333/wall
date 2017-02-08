import React, { Component } from 'react';

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.input.addEventListener('search', this.handleSearch);
  }

  componentWillUnmount() {
    this.input.removeEventListener('search', this.handleSearch);
  }

  render() {
    let {onSearch, ...inputProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <input type="search" {...inputProps} ref={input => this.input = input} />
    )
  }

  handleSearch(e) {
    this.props.onSearch && this.props.onSearch(e);
  }

}

export default SearchInput;
