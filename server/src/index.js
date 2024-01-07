import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const port = 8080

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const __dirname = path.resolve()

app.get('/', (req, res) => {
	res.json({ message: 'Docker is easy'})
})

function checkAnswer(filename, output) {
	// 저장된 filename의 답안과 output을 비교
	return true;
}

app.post('/submit', (req, res) => {
	const code = req.body.code  // http 공식

	const uuid = uuidv4()
	const filename = `code.c`
	const dir = path.join(__dirname, 'code', uuid)
	
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}

	const filepath = path.join(dir, filename)
	console.log(filepath)

	fs.writeFile(filepath, code, (err) => {
		if (err) {
			console.log(err)
			res.status(400).send({ message: 'File creation failed'})
		} else {
			console.log(`File ${filename} written successfully`)
			
			// shell 실행
			const cp = spawn('./run_docker.sh', [uuid])

			cp.stdout.on('data', (data) => {
				// 유저가 제출한 코드의 실행결과
				const output = data.toString()
				console.log('stdout:' , output)

				const isAnswer = checkAnswer(filename, output)
				res.send({ message: isAnswer ? '맞췄습니다!' : '틀렸습니다', output, isAnswer })
			})
			cp.stderr.on('data', (data) => {
				console.error(data.toString())
			})
		}
	})
})

app.listen(port, () => console.log(`app listening on ${port}`))