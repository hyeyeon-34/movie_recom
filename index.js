const express = require('express');
const cors= require('cors')
const PORT = 8080
const app = express();
const path = require('path')
const spawn = require('child_process').spawn
require('dotenv').config();
app.use(cors())
app.use(express.json())

const isDevelopment = () => {
    return process.env.NODE_ENV === 'development'
}

const pythonExePath = isDevelopment() 
    ? path.join(__dirname, 'venv', 'bin', 'python3') 
    : path.join('/home/ubuntu/miniconda', 'envs', 'myenv', 'bin', 'python3');


//   path.join(
//     'C:',
//     'conda',
//     'envs',
//     'recon_env',
//     'python.exe'
//   )

// const pythonPath = path.join(
//     '/home/ubuntu/miniconda',
//     'envs',
//     'myenv',
//     'bin',
//     'python3'
//   );


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


app.get('/', (req, res) => {
  res.send('Hi world');
});


app.get('/random/:count', (req, res) => {
    try {
        const count = parseInt(req.params.count);
        // EC2 서버에서 현재 실행 중인 Node.js 파일의 절대 경로를 기준으로 설정.
        const scriptPath = path.join(__dirname, 'resolver.py');
    
    
        // Spawn the Python process with the correct argument
        const result = spawn(pythonExePath, [scriptPath, 'random', count]);
    
    
        let responseData = '';
    
    
        // Listen for data from the Python script
        result.stdout.on('data', (data) => {
          responseData += data.toString();
        });
    
    
        // Listen for errors from the Python script
        result.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
          res.status(500).json({ error: data.toString() });
        });


    
        // Handle the close event of the child process
        result.on('close', (code) => {
          if (code === 0) {
            const jsonResponse = JSON.parse(responseData);
            res.status(200).json(jsonResponse);
          } else {
            res
              .status(500)
              .json({ error: `Child process exited with code ${code}` });
          }
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
})



app.get('/latest/:count', (req, res) => {
    
    const scriptPath = path.join(__dirname, "resolver.py")
    const count = req.params.count
    // C:\conda\envs\recom_env
    const result = spawn(pythonExePath, [scriptPath, 'latest', count])
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
    const genre = req.params.genre
    const count = req.params.count
    // C:\conda\envs\recom_env
    const result = spawn(pythonExePath, [scriptPath, 'genres', genre, count])
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
    const item = req.params.item
    // C:\conda\envs\recom_env
    const result = spawn(pythonExePath, [scriptPath, 'item-based', item])
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
  
  

  app.post('/user-based', (req,res)=>{
    const scriptPath = path.join(__dirname, "recommendation.py")
    const inputRatingDict = req.body
    // C:\conda\envs\recom_env
    const result = spawn(pythonExePath, [scriptPath, 'user-based'])
    let responseData = ""


// 파이썬 스크립트로 JSON 데이터를 전달
    result.stdin.write(JSON.stringify(inputRatingDict));
    result.stdin.end(); // 더 이상 데이터가 없으면 끝

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
  
  

 