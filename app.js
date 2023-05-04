const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  // first get list of posts
  const posts = postBank.list();
  // then prepare some html
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
          
        </div>`
        )
        .join("")}
    </div>
  </body>
</html>`;

  res.send(html);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const posts = postBank.find(id);
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <div class='news-item'>
      <p>
        <span class="news-position">${posts.id}. ▲</span>
        ${posts.title}
        <small>(by ${posts.name})</small>
      </p>
     <p> ${posts.content} 
     </p>
    </div>`;
  if (!posts.id) {
    throw new Error("this page is not found, sorry  ");
  } else {
    res.send(html);
  }
});

const PORT = 1337;

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404);
  res.send({
    name: err.name,
    message: err.message,
  });
});
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
