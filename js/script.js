const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const menu = document.querySelector('.gameOverMenu')
const score = document.querySelector('.score')

const size = 30
const time = 100

const snake = [
    { x: 0, y: 0 },
    { x: 0, y: 30 }
]

const randomNumber = (min, max) => {
    return Math.round(Math.random()*(max-min)+min)
}

const randomPosition = () => {
    const number = randomNumber(0,canvas.width-size)
    return Math.round(number/30)*30
}

const randomColor = () => {
    const red = randomNumber(30,255)
    const green = randomNumber(30,255)
    const blue = randomNumber(30,255)
    return `rgb(${red},${green},${blue})`
}

const food = {x: randomPosition(), y:randomPosition(), color:randomColor()}

let direction, loopId, game, allowDirection




const drawSnake = () => {
    snake.forEach( (position, index) =>{

        ctx.fillStyle = "#bbb"

        if(index == snake.length-1){
            ctx.fillStyle = "#eee"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })

}

const moveSnake = () => {
    if(!direction) return
    const head = snake[snake.length-1]

    if (direction == "r"){
        snake.push({x: head.x + size, y: head.y})
    }
    if (direction == "l"){
        snake.push({x: head.x - size, y: head.y})
    }
    if (direction == "u"){
        snake.push({x: head.x, y: head.y - size})
    }
    if (direction == "d"){
        snake.push({x: head.x, y: head.y + size})
    }
    
    snake.shift()
}

const drawFood = () => {
    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0

    canvas.style.boxShadow = `5px 5px 20px ${color}` 
}

const drawGrid = () => {
    ctx.lineWidth = 2
    ctx.strokeStyle = "#1e1e1e"

    for(let i = size; i < canvas.width; i+=size){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length-1]

    if(head.x == food.x && head.y == food.y){
        snake.push(head)  

        let x = randomPosition()
        let y = randomPosition()
        
        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()

        computePoint()
    } 
}

const checkCollision = () => {
    const head = snake[snake.length-1]
    const canvasLimit = canvas.width-size

    const wallCollision = head.x > canvasLimit || head.x < 0 || head.y > canvasLimit || head.y < 0 

    const selfCollision = snake.find((position, index) => {
        return index != snake.length-1 && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver()
    } 
}

const computePoint = () => {
    score.innerHTML = +score.innerHTML + 1

    console.log(score.innerHTML);
}

const gameLoop = () => {
    clearInterval(loopId)

    if(game == 1) allowDirection = 1

    ctx.clearRect(0,0,600,600)

    drawFood()
    moveSnake()
    drawSnake()
    drawGrid()
    checkCollision()
    checkEat()
    
    loopId = setTimeout(() => gameLoop(), time)
}

const gameOver = () => {
    direction = undefined
    game = 0
    allowDirection = 0
    canvas.style.filter = "blur(3px)"
    canvas.style.boxShadow = "" 
    menu.style.display = "block"
}

game = 1
gameLoop()

document.addEventListener ('keydown', (event) => {
    if (event.key == "ArrowRight" && direction != "l" && allowDirection==1) direction = "r"
    if (event.key == "ArrowLeft" && direction != "r" && allowDirection==1) direction = "l"
    if (event.key == "ArrowUp" && direction != "d" && allowDirection==1) direction = "u"
    if (event.key == "ArrowDown" && direction != "u" && allowDirection==1) direction = "d"
    allowDirection = 0
})

