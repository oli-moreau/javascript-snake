/************************************************************** Declaration **************************************************************/

//Create the canvas, set in 2d
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight - 100

//Colors
const canvas_background = '#24292e'
const snake_color = '#32a852'
const food_color = '#ff0000'
let pause = false

//Create the snake (each array entry is a part of it) in a certain spot
let snake = [
  {'x': 180, 'y': 100},
  {'x': 160, 'y': 100},
  {'x': 140, 'y': 100},
  {'x': 120, 'y': 100},
  {'x': 100, 'y': 100}
]

//Startup velocity (the traveling distance when the game start)
let velocity = {'x' : 20, 'y' : 0}

//How fast the main()->setTimeout is looped, in ms
let timer_speed = 75

//Food and Score
let food = {'x': 0, 'y': 0}
let score = 0
let display_score = document.querySelector('.score_container')

//Start the game
start_game()

/************************************************************** Game parameters **************************************************************/

//Start the game
function start_game() {
  main()
  gen_food()
  document.addEventListener("keydown", change_direction)
}

//Main call that loops functions
function main() {
  setTimeout(() => {
    clear_snake()
    move_snake()
    draw_snake()
    draw_food()
    if (game_over() || pause == true) return
    main()
  }, timer_speed)
}

//Game over
function game_over() {
  let head = snake[0]
  const collision = {
    'wall' : (head.x < 0 || head.y < 0 || head.x > canvas.width || head.y > canvas.height),
    'body' : (snake.slice(4).some(body => body.x == head.x && body.y == head.y))
  }
  if (collision.wall || collision.body) restart_game()
}

//Pause the game
function pause_menu() {
  (pause == true) ? (pause = false, main()) : pause = true
}

//Restart the game
function restart_game() {
  pause = true
  setTimeout(() => {
    location.reload()
  }, 1000)
}

//Makes the main setTimeout unable to go faster than 15ms
function timer_limit() {
  (timer_speed < 15) ? timer_speed = timer_speed : timer_speed -= 5
}

/************************************************************** Snake **************************************************************/

//Draw a snake part for each data in the array
function draw_snake() {
  snake.forEach(draw_snake_part)
}

//Draw part of the snake for each array entry
function draw_snake_part(snake_part) {
  ctx.fillStyle = snake_color
  ctx.fillRect(snake_part.x, snake_part.y, 20, 20)
}

//Movement of the snake
function move_snake() {
  const move_head = {
    'x': snake[0].x + velocity.x,
    'y': snake[0].y + velocity.y
  }
  snake.unshift(move_head)
  eat_food(snake[0])
}

//Verify if the head has the same location of the food
function eat_food(head) {
  const eat = (head.x == food.x && head.y == food.y)
  eat ? (gen_food(), timer_limit(), score += 5, display_score.textContent = score) : snake.pop()
}

//Clear drawings (background + snake)
function clear_snake() {
  ctx.fillStyle = canvas_background
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
}

/************************************************************** Food **************************************************************/

//Draw the food
function draw_food() {
  ctx.fillStyle = food_color
  ctx.beginPath()
  ctx.arc(food.x + 10, food.y + 10, 10, 0, (2*Math.PI))
  ctx.closePath()
  ctx.fill()
}

//Generate the food in a random location
function gen_food() {
  food.x = random_food(200, canvas.width - 100)
  food.y = random_food(200, canvas.height - 100)

  function random_food(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 20) * 20
  }
}

/************************************************************** Keybinds **************************************************************/

function change_direction(e) {
  const key = e.keyCode

  //Assigning the arrow, WASD and P keys
  const keys = {
    'UP' : 38, 'LEFT' : 37, 'DOWN' : 40, 'RIGHT' : 39,
    'W' : 87, 'A' : 65, 'S' : 83, 'D' : 68,
    'P' : 80
  }

  //Ongoing directions
  const directions = {
    'up' : (velocity.y == -20),
    'down' : (velocity.y == 20),
    'right' : (velocity.x == 20),
    'left' : (velocity.x == -20)
  }

  //Movements
  if ((key == keys.UP || key == keys.W) && !directions.down) {velocity.x = 0; velocity.y = -20}
  if ((key == keys.LEFT || key == keys.A) && !directions.right) {velocity.x = -20; velocity.y = 0}
  if ((key == keys.DOWN || key == keys.S )&& !directions.up) {velocity.x = 0; velocity.y = 20}
  if ((key == keys.RIGHT || key == keys.D) && !directions.left)  {velocity.x = 20; velocity.y = 0}

  //Others
  if (key == keys.P) {pause_menu()}
}
