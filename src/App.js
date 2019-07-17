import React from 'react'
import * as BooksAPI from './BooksAPI'
import Search from './Search'
import Book from './Book'
import { Link, Route } from 'react-router-dom'
import './App.css'

const BookShelf = ({ onUpdateShelf, relatedShelf, shelfName }) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelfName}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {relatedShelf.map((book)=>(
            <li key={book.id}>
              <Book relatedBook={book} onChangeShelf={onUpdateShelf}/>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shelf: {
        currentlyReading: [],
        wantToRead: [],
        read: []
      }
    }
  }

  componentDidMount() {
    const shelf = {
      currentlyReading: [],
      wantToRead: [],
      read: []
    };

    BooksAPI.getAll()
      .then((books) => {
        books.map((book) => (
          book.shelf === 'currentlyReading' ? shelf.currentlyReading.push(book) :
          (book.shelf === 'wantToRead' ? shelf.wantToRead.push(book) : shelf.read.push(book))
        ))
        this.setState({ shelf });
      })
  }

  updateShelf = (movedShelf, book) => {
    const shelfs = this.state.shelf,
      preShelf = book.shelf

    if (shelfs[preShelf]) {
      const newArray = shelfs[preShelf].filter(b => (b.id !== book.id));
      shelfs[preShelf] = newArray;
    }

    if (movedShelf !== 'none') {
      book.shelf = movedShelf;
      shelfs[movedShelf].push(book);
    }
    this.setState({ shelfs })
    BooksAPI.update(book, movedShelf)
  }

  render() {
    const { currentlyReading, wantToRead, read } = this.state.shelf;
    return (
      <div className="app">
        <Route exact path='/' render={()=>(
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
                <BookShelf onUpdateShelf={this.updateShelf} relatedShelf={currentlyReading} shelfName='Currently Reading'/>
                <BookShelf onUpdateShelf={this.updateShelf} relatedShelf={wantToRead} shelfName='Want to Read'/>
                <BookShelf onUpdateShelf={this.updateShelf} relatedShelf={read} shelfName='Read'/>
            </div>
            <div className="open-search" >
              <Link to='/add'>Add a book</Link>
            </div>
          </div>
        )}/>

        <Route path='/add' render={() => (
            <Search books={this.state.shelf} changeShelf={this.updateShelf}/>
          )}
        />
      </div>
    );
  }

}

export default App;