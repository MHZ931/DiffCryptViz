import { Skinny } from './skinny.js';

const activeInput = document.getElementById("activeInput");
const roundInput = document.getElementById("roundInput");
const container = document.getElementById("tikz-container");

let actives = activeInput.value.split(",").map(Number).filter(n => !isNaN(n));
let rounds = Number(roundInput.value);

async function render() {
  
  const content = await Skinny(actives, rounds);

  const s = document.createElement('script');
  s.setAttribute('type','text/tikz');
  s.textContent = content;

  container.innerHTML = "";
  container.appendChild(s);
}

let debounce_update = null;
let debounce_do = false;

activeInput.addEventListener('input',function() {

  actives = activeInput.value.split(",").map(Number).filter(n => !isNaN(n));
  rounds = Number(roundInput.value);

  if(debounce_update) {
    debounce_do = true;
    return;
  }
  render();
  debounce_update = setTimeout(function() {
    debounce_update = null;
    if(debounce_do) {
      render();
    }
    debounce_do = false;
  },500);
})

roundInput.addEventListener('input',function() {

  actives = activeInput.value.split(",").map(Number).filter(n => !isNaN(n));
  rounds = Number(roundInput.value);

  if(debounce_update) {
    debounce_do = true;
    return;
  }
  render();
  debounce_update = setTimeout(function() {
    debounce_update = null;
    if(debounce_do) {
      render();
    }
    debounce_do = false;
  },500);
})

render();