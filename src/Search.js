import React from 'react'
import { Link } from 'react-router-dom'
import Debounce from 'lodash'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // query: '',
      books: []
    };
    this.searchBook = this.searchBook.bind(this);
    this.emitChangeDebounced = Debounce.debounce(this.searchBook, 1000);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  searchBook = (query) => {
    // this.setState({ query: query.trim() });

    const { currentlyReading, wantToRead, read } = this.props.books,
      searchResultCount = 15,
      shelfBooks = {};

    [...currentlyReading, ...wantToRead, ...read].map((book) => (
      shelfBooks[book.id] = book.shelf
    ));

    if(query.trim())
      BooksAPI.search(query, searchResultCount)
        .then((searchBooks) => {
          if ('error' in searchBooks) {
            alert(`sorry, didn't find a book or an author that has the string '${query}'`);
          } else {
            const books = searchBooks.map((searchBook) => {
              if (searchBook.id in shelfBooks) {
                searchBook.shelf = shelfBooks[searchBook.id];
              } else {
                searchBook.shelf = 'none';
              }
              return searchBook;
            })

            this.setState({ books })
          }
        })
        .catch((e) => {
          console.log(e);
          alert(`Oh no! There was an error making a request for the book`);
        });
  }

  render() {
    const { books } = this.state;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to='/'>Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              // value={query}
              onChange={(e)=>this.emitChangeDebounced(e.target.value)}
              />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books.map((book,id)=>(
              <Book
                key={id}
                relatedBook={book}
                onChangeShelf={this.props.changeShelf}/>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default Search