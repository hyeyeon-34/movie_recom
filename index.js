const express = require('express');
const cors= require('cors')
const PORT = 8080
const app = express();
const path = require('path')
const spawn = require('child_process').spawn
app.use(cors())
app.use(express.json())

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


app.get('/', (req, res) => {
  res.send('Hi world');
});

app.get('/random/:count', (req, res) => {
    const scriptPath = path.join(__dirname, "resolver.py")
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3')
    const count = req.params.count
    // C:\conda\envs\recom_env
    const result = spawn(pythonPath, [scriptPath, 'random', count])
    let responseData = ""

    result.stdout.on('data', function(data) { 
        responseData += data.toString()
    })

    result.on('close', (code) => {
        if(code === 0 ){
            const jsonResponse = JSON.parse(responseData)
            res.status(200).json(jsonResponse)
        }
        else{
            res.status(500).json({error: `Child process exited with code ${code}`})
        }
    })
    result.stderr.on('data', (data)=>{
        console.error(`stderr:${data}`)
    })
});

app.get('/latest/:count', (req, res) => {
    const scriptPath = path.join(__dirname, "resolver.py")
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3')
    const count = req.params.count
    // C:\conda\envs\recom_env
    const result = spawn(pythonPath, [scriptPath, 'latest', count])
    let responseData = ""

    result.stdout.on('data', function(data) { 
        responseData += data.toString()
    })
     result.on('close', (code) => {
        if(code === 0 ){
            const jsonResponse = JSON.parse(responseData)
            res.status(200).json(jsonResponse)
        }
        else{
            res.status(500).json({error: `Child process exited with code ${code}`})
        }
    })
    result.stderr.on('data', (data)=>{
        console.error(`stderr:${data}`)
    })
  });
  
  
  

app.get('/genres/:genre/:count', (req, res) => {
    const scriptPath = path.join(__dirname, "resolver.py")
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3')
    const genre = req.params.genre
    const count = req.params.count
    // C:\conda\envs\recom_env
    const result = spawn(pythonPath, [scriptPath, 'genres', genre, count])
    let responseData = ""

    result.stdout.on('data', function(data) { 
        responseData += data.toString()
    })
     result.on('close', (code) => {
        if(code === 0 ){
            const jsonResponse = JSON.parse(responseData)
            res.status(200).json(jsonResponse)
        }
        else{
            res.status(500).json({error: `Child process exited with code ${code}`})
        }
    })
    result.stderr.on('data', (data)=>{
        console.error(`stderr:${data}`)
    })
  });
  
  
  

  app.get('/item-based/:item', (req,res)=>{
    const scriptPath = path.join(__dirname, "recommendation.py")
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3')
    const item = req.params.item
    // C:\conda\envs\recom_env
    const result = spawn(pythonPath, [scriptPath, 'item-based', item])
    let responseData = ""

    result.stdout.on('data', function(data) { 
        responseData += data.toString()
    })
     result.on('close', (code) => {
        if(code === 0 ){
            const jsonResponse = JSON.parse(responseData)
            res.status(200).json(jsonResponse)
        }
        else{
            res.status(500).json({error: `Child process exited with code ${code}`})
        }
    })
    result.stderr.on('data', (data)=>{
        console.error(`stderr:${data}`)
    })
  });
  