import TYPES from 'tedious';
import express from 'express';
import knex from 'knex';
import https from 'http';

const app = express();
const port = 3000;
app.set("view engine","ejs");

const database = knex({
  client: 'mssql',
  connection: {
    host: '192.168.1.4',
    user: 'sa',
    password: 'KVSmm%12',
    database: 'Gemeindevergleich_2023',
  },
});

app.get("/",(req,res)=>
{
    https.get('http://localhost:8081', (resp) => {
      let data = '';
    
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        data = JSON.parse(data);
        //console.log(data);
        res.render("places.ejs",{data: data });
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

app.get("/shooters",(req,res)=>
{
  database
    .select('Id', 'Firstname', 'Lastname')
    .from("Shooters")
    .then((results) => {
        res.render("shooters",{aDonuts: results });
    });
});
// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})

app.listen(port, () => {
  console.log(`Service listening on port ${port}`)
});