//P0
let p0ColorInput = document.getElementById("p0-color-input");
let p0hexCodeOutput = document.getElementById("p0-hex-code");
let p0rgbCodeOutput = document.getElementById("p0-rgb-code");
func returnNum(string){
  let s1 = string.slice(0, 0);
  let s2 = string.slice(1, 1);
  let guess = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
  for (let i = 0; i < guess.length; i++){
    if (guess[i] == s1){
      s1 = 16*i;
    }
    if (guess[i] == s2){
      s2 = i;
    }
  }
  let finalvalue = s1+s2
  return finalvalue;
}
document.getElementById("p0-submit").onclick = () => {
  console.log(p0ColorInput.value);//for my dumbass who doesn't even know what does the input store, such a stupid thing
  p0hexCodeOuptut.innerHTML = p0ColorInput.value;
  let r = returnNum(p0ColorInput.value.slice(1, 2));
  let b = returnNum(p0ColorInput.value.slice(3, 4);
  let g = returnNum(p0ColorInput.value.slice(5, 6));
  p0rgbCodeOutput.innerHTML = toString(r) + toString(b) + toString(g);//I knowi could've simplify this but remember, this is a shitty project, no one gives a 
}
