// Make sure Firebase App and Database SDKs are loaded before this script

(function() {
  if (typeof firebase === 'undefined' || !firebase.database) {
    console.error('Firebase database SDK not found. Make sure firebase-app-compat.js and firebase-database-compat.js are loaded first.');
    return;
  }

  const db = firebase.database();
  const lobbyRef = db.ref('lobby'); // adjust path if your DB uses something else

  const lobbyBody = document.getElementById('lobby-body');
  const emptyRow = document.getElementById('lobby-empty-row');

  lobbyRef.on('value', snapshot => {
    const data = snapshot.val();

    // Clear table body
    lobbyBody.innerHTML = '';

    if (!data) {
      // No matches
      lobbyBody.appendChild(emptyRow);
      return;
    }

    // Populate table with live data
    Object.entries(data).forEach(([uuid, info]) => {
      const row = document.createElement('tr');

      const uuidCell = document.createElement('td');
      uuidCell.className = "px-4 py-3 text-gray-200";
      uuidCell.textContent = uuid;

      const sideCell = document.createElement('td');
      sideCell.className = "px-4 py-3 text-gray-200";
      sideCell.textContent = info.side || 'Unknown';

      row.appendChild(uuidCell);
      row.appendChild(sideCell);

      lobbyBody.appendChild(row);
    });
  }, error => {
    console.error('Lobby listener failed:', error);
  });
})();








