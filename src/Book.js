import React from 'react'

const Book = ({ relatedBook, onChangeShelf }) => (
  <div className="book">
    <div className="book-top">
      <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url('${relatedBook.imageLinks?relatedBook.imageLinks.smallThumbnail:""}')` }}></div>
      <div className="book-shelf-changer" >
        <select value={relatedBook.shelf} onChange={(event)=>onChangeShelf(event.target.value,relatedBook)}>
          <option value="none" disabled>Move to...</option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    </div>
    <div className="book-title">{relatedBook.title}</div>
    <div className="book-authors">{relatedBook.authors}</div>
  </div>
)
export default Book;