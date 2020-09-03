export default class Likes {
  constructor() {
    this.likes = [];
  }
  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // Store data to the local storage
    this.storeData();
    return like;
  }
  deleteLike(id) {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);

    // Store data to the local storage
    this.storeData();
  }
  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }
  numLikes() {
    return this.likes.length;
  }
  storeData() {
    localStorage.setItem('id', JSON.stringify(this.likes));
  }
  readStorage() {
    const storage = localStorage.getItem('id');
    if (storage) this.likes = JSON.parse(storage);
  }
}
