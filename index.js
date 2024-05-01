import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json")
        return JSON.parse(data);
    } catch (error) {
        console.log(error)
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data))
    } catch (error) {
        console.log(error)
    }
}

readData();

app.get("/", (req, res) => {
    res.send("Hola, me llamo Lautaro!");
});

app.get("/productos", (req, res) => {
    const data = readData();
    res.json(data.productos);
});

app.get("/productos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const producto = data.productos.find((producto) => producto.id == id);
    res.json(producto);
})

app.post("/productos", (req, res) => {
    const data = readData();
    const body = req.body;
    const newProducto = {
        id: data.productos.length + 1,
        ...body,
    };
    data.productos.push(newProducto);
    writeData(data);
    res.json(newProducto);
});

app.put("/productos/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const productoIndex = data.productos.findIndex((producto) => producto.id == id);
    data.productos[productoIndex] = {
        ...data.productos[productoIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Producto actualizado con éxito. ID: " + id });
});

app.delete("/productos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const productoIndex = data.productos.findIndex((producto) => producto.id == id);
    data.productos.splice(productoIndex, 1);
    writeData(data);
    res.json({message: "Producto eliminado con éxito. ID: "+ id})
});

app.listen(3000, () => {
    console.log('servidor escuchando en el puerto 3000');
});