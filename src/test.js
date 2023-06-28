//  Deklarasi variabel untuk * dan spasi
let a = "";
let b = "";
let c = "";

// Looping untuk membuat 5 baris
for (let i = 0; i < 7; i++) {
  if (i < 4) {
    for (let j = 0; j <= i; j++) {
      a += "*";
    }
    for (let k = i; k < 3; k++) {
      b += " ";
    }
    for (let l = 1; l <= i; l++) {
      c += "*";
    }
  } else if (i >= 3) {
    for (let j = i; j < 7; j++) {
      a += "*";
    }
    for (let k = 4; k <= i; k++) {
      b += " ";
    }
    for (let l = i; l < 6; l++) {
      c += "*";
    }
  }
  console.log(b + a + c);
  a = "";
  b = "";
  c = "";
}
