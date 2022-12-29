const canvasId = 'canvas';
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  const DIRECTION_UP = 'DIRECTION_UP ';
  const DIRECTION_DOWN = 'DIRECTION_DOWN';
  const DIRECTION_LEFT = 'DIRECTION_LEFT';
  const DIRECTION_RIGHT = 'DIRECTION_RIGHT';

  let gameOver = false;
  const heroPosition = [
    { x: 10, y: 17 },
    { x: 10, y: 16 },
    { x: 10, y: 15 },
  ];

  const foodPosition = {
    x: 10,
    y: 20,
  };

  let heroDirection = DIRECTION_DOWN;

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */

  const noOfRows = 600 / 20;
  const noOfColumns = 400 / 20;
  function drawBackground(ctx) {
    const { width, height } = canvas.getBoundingClientRect();

    //Draw border
    ctx.strokeStyle = 'lightgray';
    ctx.rect(0, 0, width, height);
    ctx.stroke();
    ctx.lineWidth = 0.5;

    // ctx.moveTo(0, 0);
    // ctx.lineTo(200, 300);
    // ctx.stroke();

    //Draw rows
    for (let i = 0; i < noOfRows; i++) {
      ctx.moveTo(0, i * 20);
      ctx.lineTo(400, i * 20);
    }

    //Draw cols
    for (let i = 0; i < noOfColumns; i++) {
      ctx.moveTo(i * 20, 0);
      ctx.lineTo(i * 20, 600);
    }

    ctx.stroke();
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawHero(ctx) {
    ctx.fillStyle = 'red';
    heroPosition.forEach((position) => {
      ctx.fillRect(position.x * 20, position.y * 20, 20, 20);
    });
    ctx.fillStyle = 'blue';
    ctx.fillRect(heroPosition[0].x * 20, heroPosition[0].y * 20, 20, 20);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawFood(ctx) {
    ctx.fillStyle = 'green';
    // console.log(heroPosition.x * 20, heroPosition.y * 20);
    ctx.fillRect(foodPosition.x * 20, foodPosition.y * 20, 20, 20);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawWorld(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    drawFood(ctx);
    drawHero(ctx);
  }

  let lastAnimationTime;
  const step = (time) => {
    if (!lastAnimationTime) {
      lastAnimationTime = time;
    } else if (time - lastAnimationTime > 200) {
      if (gameOver) {
        return;
      }
      lastAnimationTime = time;
      let { x, y } = heroPosition[0];
      switch (heroDirection) {
        case DIRECTION_DOWN:
          y = y + 1;
          break;
        case DIRECTION_UP:
          y = y - 1;
          break;
        case DIRECTION_LEFT:
          x = x - 1;
          break;
        case DIRECTION_RIGHT:
          x = x + 1;
          break;
      }

      if (
        foodPosition.x == heroPosition[0].x &&
        foodPosition.y == heroPosition[0].y
      ) {
        placeRandomFood();
        heroPosition.push({
          x: heroPosition[heroPosition.length - 1].x,
          y: heroPosition[heroPosition.length - 1].y,
        });
      }

      let heronohead = heroPosition.slice(1);
      const isInArray = heronohead.some(
        (item) => item.x == heroPosition[0].x && item.y == heroPosition[0].y
      );

      if (y >= noOfRows || x >= noOfColumns || x < 0 || y < 0 || isInArray) {
        gameOver = true;
      }

      if (!gameOver) {
        const newHead = heroPosition.pop();
        newHead.x = x;
        newHead.y = y;
        heroPosition.unshift(newHead);
      }
    }
    drawWorld(ctx);

    window.requestAnimationFrame(step);
  };

  document.addEventListener('keyup', (evt) => {
    console.log('keyup', evt.key);
    switch (evt.key) {
      case 'ArrowLeft':
        heroDirection = DIRECTION_LEFT;
        break;
      case 'ArrowRight':
        heroDirection = DIRECTION_RIGHT;
        break;
      case 'ArrowUp':
        heroDirection = DIRECTION_UP;
        break;
      case 'ArrowDown':
        heroDirection = DIRECTION_DOWN;
        break;
    }
  });

  window.requestAnimationFrame(step);
  // placeRandomFood();

  function placeRandomFood() {
    foodPosition.x = Math.floor(Math.random() * noOfColumns);
    foodPosition.y = Math.floor(Math.random() * noOfRows);
  }
});
