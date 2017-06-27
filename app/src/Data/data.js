/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's data api
 */

/**
 * Get book detail by id
 */
function getBook(id, callback){
  callback("test");
}

/**
 * Get all books sorted personally
 */
function getBooks(callback){
  callback("test-books");
}

module.exports = {getBook, getBooks};
