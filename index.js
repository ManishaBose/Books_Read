import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    connectionString:process.env.DATABASE_URL
});

db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

async function readData(sortOrder = 'read_on', genre='',search=''){
    var books = {
        isbn: [],
        name: [],
        author: [],
        rating: [],
        genre: [],
        localISBN: []
    };
    try{
        let result;
        if(!genre && !search){
            result = await db.query(`SELECT isbn, name, author, rating, genre, local_img_isbn FROM books ORDER BY ${sortOrder} desc nulls last`);
        } else if(genre){ 
            result = await db.query(`SELECT isbn, name, author, rating, genre, local_img_isbn FROM books WHERE genre = '${genre}' ORDER BY ${sortOrder}`);
        } else if(search){
            result = await db.query(`SELECT isbn, name, author, rating, genre, local_img_isbn FROM books WHERE LOWER(name) LIKE LOWER($1) ORDER BY ${sortOrder}`,[`%${search.trim()}%`]);
        }
        const arr = result.rows;
        arr.forEach(element => {
            books.isbn.push(element.isbn);
            books.name.push(element.name);
            books.author.push(element.author);
            books.rating.push(element.rating);
            books.genre.push(element.genre.toUpperCase());
            books.localISBN.push(element.local_img_isbn);
        });
    } catch(err){
        console.log(err);
        throw err;
    }
    return books;
}

async function readDetail(identity) {
    var books = {
        isbn: null,
        name: null,
        author: null,
        rating: null,
        genre: null,
        localISBN: null
    };
    try {
        let result = await db.query(`SELECT isbn, name, author, rating, genre, local_img_isbn FROM books WHERE isbn = '${identity}'`);
        let arr = result.rows;
        console.log(arr);

        if (arr.length === 0) {
            result = await db.query(`SELECT isbn, name, author, rating, genre, local_img_isbn FROM books WHERE local_img_isbn = '${identity}'`);
            arr = result.rows;
            console.log(arr);
        }

        if (arr.length > 0) {
            books.isbn = arr[0].isbn;
            books.name = arr[0].name;
            books.author = arr[0].author;
            books.rating = arr[0].rating;
            books.genre = arr[0].genre.toUpperCase();
            books.localISBN = arr[0].local_img_isbn;
        }
    } catch(err) {
        console.log(err);
        throw err;
    }
    return books;
}


app.get("/",async (req,res)=>{
    const books = await readData();
    res.render("index.ejs",{title:"Welcome to Manisha's Book Showcase!", isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/rating", async (req,res) => {
    const books = await readData('rating DESC');
    res.render("index.ejs",{title:"Sorted by rating",isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/alphabetically", async (req,res) => {
    const books = await readData('name');
    res.render("index.ejs",{title:"Sorted lexicographycally",isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/fiction", async(req,res) =>{
    const books = await readData('rating DESC','fiction');
    res.render("index.ejs",{title:"FICTION",isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/nonfiction", async(req,res) =>{
    const books = await readData('rating DESC','nonfiction');
    res.render("index.ejs",{title:"NON-FICTION",isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/autobiography", async(req,res) =>{
    const books = await readData('rating DESC','autobiography');
    res.render("index.ejs",{title:"AUTOBIOGRAPHY",isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/selfhelp", async(req,res) =>{
    const books = await readData('rating DESC','self-help');
    res.render("index.ejs",{title:"SELF-HELP",isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
});

app.get("/search", async(req,res) =>{
    const search = req.query.search;
    const books = await readData('rating','',search);
    console.log(books);
    var title;
    if(books.isbn.length>1){
        title = "Search Completed...";
    } else
    title = books.name[0];
    if(books){ //to do books.name[0]
        res.render("index.ejs",{title:title ,isbn:books.isbn, genre:books.genre, name:books.name, author:books.author, rating:books.rating, localISBN:books.localISBN});
    }
    else
        res.render("index.ejs");
});

app.get("/details",async(req,res)=>{
    const books = await readData();
    const identity = req.query.isbn;
    const book_detail = await readDetail(identity);
    res.render("review.ejs",{isbn:books.isbn, isbn_web:book_detail.isbn, localISBN:book_detail.localISBN, name: book_detail.name, author: book_detail.author, rating: book_detail.rating});
});

app.post("/search", async (req,res)=>{
    res.redirect(`/search?search=${encodeURIComponent(req.body.search)}`);
});

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});