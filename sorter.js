//JavaScript code for the sorter
  let items = [];

  fetch('barbie_movies.txt')
    .then(response => response.text())
    .then(text => {
      items = text.split('\n').map(line => line.trim()).filter(Boolean);
      startSorter();
    });

  function startSorter() {
    mergeSort(items);
    totalComparisons = queue.reduce((acc, pair) => acc + Math.min(pair.left.length, pair.right.length), 0);

    if (queue.length > 0) {
      const first = queue[0];
      showBattle({ left: first.left, right: first.right });
      updateStatus();
    } else {
      document.getElementById('status').textContent = "Nothing to compare.";
    }
  }
  
  let comparisons = 0;
  let totalComparisons = 0;
  let finalList = [];
  let currentLeft, currentRight;
  let queue = [];
  
  function mergeSort(list) {
    if (list.length <= 1) return list;
    const mid = Math.floor(list.length / 2);
    const left = mergeSort(list.slice(0, mid));
    const right = mergeSort(list.slice(mid));
    queue.push({ left, right, merged: [] });
    return left.concat(right); // dummy return
  }
  
  function updateStatus() {
    document.getElementById('status').innerHTML = `Battle #${comparisons + 1}<br>${Math.round((comparisons / totalComparisons) * 100)}% sorted.`;
  }
  
  function showBattle(pair) {
    currentLeft = pair.left;
    currentRight = pair.right;
    document.getElementById('left').textContent = currentLeft[0];
    document.getElementById('right').textContent = currentRight[0];
  }
  
  function pick(winner) {
    const pair = queue[0];
    const l = pair.left;
    const r = pair.right;
    const m = pair.merged;
  
    if (winner === 'left') m.push(l.shift());
    else if (winner === 'right') m.push(r.shift());
    else if (winner === 'equal') {
      m.push(l.shift());
      m.push(r.shift());
    }
  
    comparisons++;
    updateStatus();
  
    if (l.length && r.length) {
      showBattle({ left: l, right: r });
    } else {
      pair.merged = m.concat(l).concat(r);
      queue.shift();
      if (queue.length) {
        const next = queue[0];
        showBattle({ left: next.left, right: next.right });
      } else {
        finalList = pair.merged;
        document.querySelector('.container').style.display = 'none';
        document.getElementById('status').style.display = 'none';
        document.getElementById('done').style.display = 'block';
        const ol = document.getElementById('result');
        finalList.forEach((item, i) => {
          const li = document.createElement('li');
          li.textContent = item;
          ol.appendChild(li);
        });
      }
    }
  }
  
  document.getElementById('left').onclick = () => pick('left');
  document.getElementById('right').onclick = () => pick('right');
  document.getElementById('equal').onclick = () => pick('equal');
  document.getElementById('skip').onclick = () => pick('equal'); // treat skip as tie
  
  mergeSort(items);
  totalComparisons = queue.reduce((acc, pair) => acc + Math.min(pair.left.length, pair.right.length), 0);
  
  if (queue.length > 0) {
    const first = queue[0];
    showBattle({ left: first.left, right: first.right });
    updateStatus();
  } else {
    document.getElementById('status').textContent = "Nothing to compare.";
  }
  
  