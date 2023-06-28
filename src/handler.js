const { nanoid } = require("nanoid");
const { books, bookDetails, bookQuery, booksTemp, readFinishBooks, readBooks, finishBooks } = require("./books");

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);

  let finished = false;
  if (pageCount === readPage) finished = true;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const preview = {
    id,
    name,
    publisher,
  };

  const query = {
    id,
    name,
    reading,
    finished,
  };

  if (name === undefined || name === "") {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  bookDetails.push(newBook);
  books.push(preview);
  bookQuery.push(preview);
  readFinishBooks.push(query);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  books.splice(0, books.length);
  booksTemp.splice(0, booksTemp.length);
  readBooks.splice(0, readBooks.length);
  finishBooks.splice(0, finishBooks.length);

  const readingBooks = (value, booksQuery) => {
    readFinishBooks.forEach((e) => {
      if (e.reading === value) {
        booksQuery.forEach((i) => {
          if (i.id === e.id) readBooks.push(i);
        });
      }
    });
  };

  const finishedBooks = (value, booksQuery) => {
    readFinishBooks.forEach((e) => {
      if (e.finished === value) {
        booksQuery.forEach((i) => {
          if (i.id === e.id) finishBooks.push(i);
        });
      }
    });
  };

  const getBooksData = () => {
    const response = h.response({
      status: "success",
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  };

  if (name !== undefined) {
    readFinishBooks.forEach((e) => {
      const bookName = e.name.toLowerCase();
      const findBook = bookName.search(name);
      if (findBook !== -1) {
        bookQuery.forEach((i) => {
          if (i.id === e.id) booksTemp.push(i);
        });
      }
    });

    if (reading !== undefined || finished !== undefined) {
      if (reading == 1) {
        readingBooks(true, booksTemp);
        if (finished == 1) {
          finishedBooks(true, readBooks);
          books.push(...finishBooks);
          return getBooksData();
        } else if (finished == 0) {
          finishedBooks(false, readBooks);
          books.push(...finishBooks);
          return getBooksData();
        }
        books.push(...readBooks);
        return getBooksData();
      } else if (reading == 0) {
        readingBooks(false, booksTemp);
        if (finished == 1) {
          finishedBooks(true, readBooks);
          books.push(...finishBooks);
          return getBooksData();
        } else if (finished == 0) {
          finishedBooks(false, readBooks);
          books.push(...finishBooks);
          return getBooksData();
        }
        books.push(...readBooks);
        return getBooksData();
      } else if (finished == 1) {
        finishedBooks(true, booksTemp);
        books.push(...finishBooks);
        return getBooksData();
      } else if (finished == 0) {
        finishedBooks(false, booksTemp);
        books.push(...finishBooks);
        return getBooksData();
      }
    }
    books.push(...booksTemp);
    return getBooksData();
  } else if (reading !== undefined || finished !== undefined) {
    if (reading == 1) {
      readingBooks(true, bookQuery);
      if (finished == 1) {
        finishedBooks(true, readBooks);
        books.push(...finishBooks);
        return getBooksData();
      } else if (finished == 0) {
        finishedBooks(false, readBooks);
        books.push(...finishBooks);
        return getBooksData();
      }
      books.push(...readBooks);
      return getBooksData();
    } else if (reading == 0) {
      readingBooks(false, bookQuery);
      if (finished == 1) {
        finishedBooks(true, readBooks);
        books.push(...finishBooks);
        return getBooksData();
      } else if (finished == 0) {
        finishedBooks(false, readBooks);
        books.push(...finishBooks);
        return getBooksData();
      }
      books.push(...readBooks);
      return getBooksData();
    } else if (finished == 1) {
      finishedBooks(true, bookQuery);
      books.push(...finishBooks);
      return getBooksData();
    } else if (finished == 0) {
      finishedBooks(false, bookQuery);
      books.push(...finishBooks);
      return getBooksData();
    }
  }
  books.push(...bookQuery);
  return getBooksData();
};

const getBookById = (request, h) => {
  const { id } = request.params;
  const book = bookDetails.filter((e) => e.id === id)[0];

  if (book === undefined) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBookById = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = bookDetails.findIndex((n) => n.id === id);

  if (name === undefined || name === "") {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  bookDetails[index] = {
    ...bookDetails[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  books[index] = {
    ...books[index],
    name,
    publisher,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

const deleteBookById = (request, h) => {
  const { id } = request.params;
  const index = bookDetails.findIndex((n) => n.id === id);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  bookDetails.splice(index, 1);
  books.splice(index, 1);
  return {
    status: "success",
    message: "Buku berhasil dihapus",
  };
};

module.exports = { addBook, getAllBooks, getBookById, editBookById, deleteBookById };
