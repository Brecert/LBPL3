let canvas = document.createElement('canvas');
canvas.setAttribute('width', '500');
canvas.setAttribute('height', '500');
let ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.rect(50, 50, 10, 10);
ctx.fill();
