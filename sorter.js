
let namMember = [];
let lstMember = [], parent = [], equal = [], rec = [];
let cmp1, cmp2, head1, head2, nrec;
let numQuestion, totalSize, finishSize, finishFlag;

//Get the list of items for sorting from the given text file
function fetchNames() {
  fetch('barbie_movies.txt')
    .then(response => response.text())
    .then(text => {
      namMember = text.split('\n').map(line => line.trim()).filter(Boolean);
      initList();
      showImage();
    });
}

function initList() {
  let n = 0;
  let mid;

  lstMember[n] = [];
  for (let i = 0; i < namMember.length; i++) {
    lstMember[n][i] = i;
  }
  parent[n] = -1;
  totalSize = 0;
  n++;

  for (let i = 0; i < lstMember.length; i++) {
    if (lstMember[i].length >= 2) {
      mid = Math.ceil(lstMember[i].length / 2);
      lstMember[n] = lstMember[i].slice(0, mid);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
      lstMember[n] = lstMember[i].slice(mid);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
    }
  }

  for (let i = 0; i < namMember.length; i++) rec[i] = 0;
  for (let i = 0; i <= namMember.length; i++) equal[i] = -1;

  nrec = 0;
  cmp1 = lstMember.length - 2;
  cmp2 = lstMember.length - 1;
  head1 = 0;
  head2 = 0;
  numQuestion = 1;
  finishSize = 0;
  finishFlag = 0;
}

function sortList(flag) {
  if (flag < 0) {
    rec[nrec++] = lstMember[cmp1][head1++];
    finishSize++;
    while (equal[rec[nrec - 1]] !== -1) {
      rec[nrec++] = lstMember[cmp1][head1++];
      finishSize++;
    }
  } else if (flag > 0) {
    rec[nrec++] = lstMember[cmp2][head2++];
    finishSize++;
    while (equal[rec[nrec - 1]] !== -1) {
      rec[nrec++] = lstMember[cmp2][head2++];
      finishSize++;
    }
  } else {
    rec[nrec++] = lstMember[cmp1][head1++];
    finishSize++;
    while (equal[rec[nrec - 1]] !== -1) {
      rec[nrec++] = lstMember[cmp1][head1++];
      finishSize++;
    }
    equal[rec[nrec - 1]] = lstMember[cmp2][head2];
    rec[nrec++] = lstMember[cmp2][head2++];
    finishSize++;
    while (equal[rec[nrec - 1]] !== -1) {
      rec[nrec++] = lstMember[cmp2][head2++];
      finishSize++;
    }
  }

  if (head1 === lstMember[cmp1].length && head2 < lstMember[cmp2].length) {
    while (head2 < lstMember[cmp2].length) {
      rec[nrec++] = lstMember[cmp2][head2++];
      finishSize++;
    }
  } else if (head1 < lstMember[cmp1].length && head2 === lstMember[cmp2].length) {
    while (head1 < lstMember[cmp1].length) {
      rec[nrec++] = lstMember[cmp1][head1++];
      finishSize++;
    }
  }

  if (head1 === lstMember[cmp1].length && head2 === lstMember[cmp2].length) {
    for (let i = 0; i < lstMember[cmp1].length + lstMember[cmp2].length; i++) {
      lstMember[parent[cmp1]][i] = rec[i];
    }
    lstMember.pop();
    lstMember.pop();
    cmp1 -= 2;
    cmp2 -= 2;
    head1 = 0;
    head2 = 0;
    for (let i = 0; i < namMember.length; i++) rec[i] = 0;
    nrec = 0;
  }

  if (cmp1 < 0) {
    document.getElementById("battleNumber").innerHTML =
      "Battle #" + (numQuestion - 1) + "<br>" +
      Math.floor(finishSize * 100 / totalSize) + "% sorted.";
    showResult();
    finishFlag = 1;
  } else {
    showImage();
  }
}

function showImage() {
  document.getElementById("battleNumber").innerHTML =
    "Battle #" + numQuestion + "<br>" +
    Math.floor(finishSize * 100 / totalSize) + "% sorted.";
  document.getElementById("leftField").innerHTML = toNameFace(lstMember[cmp1][head1]);
  document.getElementById("rightField").innerHTML = toNameFace(lstMember[cmp2][head2]);
  numQuestion++;
}

function showResult() {
  let ranking = 1;
  let sameRank = 1;
  let str = "<table style='width:300px; font-size:16px; margin:auto; border:1px solid black;'>";
  str += "<tr><th>Rank</th><th>Movie</th></tr>";

  for (let i = 0; i < namMember.length; i++) {
    str += "<tr><td style='border:1px solid black;'>" + ranking + "</td><td style='border:1px solid black;'>" + namMember[lstMember[0][i]] + "</td></tr>";
    if (i < namMember.length - 1 && equal[lstMember[0][i]] === lstMember[0][i + 1]) {
      sameRank++;
    } else {
      ranking += sameRank;
      sameRank = 1;
    }
  }
  str += "</table>";
  document.getElementById("resultField").innerHTML = str;
}

function toNameFace(n) {
  return namMember[n];
}

window.onload = fetchNames;
