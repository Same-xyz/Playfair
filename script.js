function encrypt() {
    let plaintext = document.getElementById('plaintext').value;
    let key = document.getElementById('key').value;
    let matrix = generateMatrix(key);
    displayMatrix(matrix); // Display the generated matrix
    let ciphertext = playfairEncrypt(plaintext, matrix);
    document.getElementById('ciphertext').value = ciphertext;
}

function playfairEncrypt(plaintext, matrix) {
    // Clean and prepare the plaintext
    plaintext = plaintext.replace(/j/g, 'i').toUpperCase().replace(/[^A-Z]/g, '');

    let pairs = createPairs(plaintext);
    let ciphertext = '';

    // Encrypt each pair
    pairs.forEach(pair => {
        let pos1 = findPosition(pair[0], matrix);
        let pos2 = findPosition(pair[1], matrix);

        if (pos1.row === pos2.row) {
            ciphertext += matrix[pos1.row][(pos1.col + 1) % 5];
            ciphertext += matrix[pos2.row][(pos2.col + 1) % 5];
        } else if (pos1.col === pos2.col) {
            ciphertext += matrix[(pos1.row + 1) % 5][pos1.col];
            ciphertext += matrix[(pos2.row + 1) % 5][pos2.col];
        } else {
            ciphertext += matrix[pos1.row][pos2.col];
            ciphertext += matrix[pos2.row][pos1.col];
        }
    });

    return ciphertext;
}

function generateMatrix(key) {
    key = key.replace(/j/g, 'i').toUpperCase().replace(/[^A-Z]/g, '');
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is typically merged with I
    let keyString = key + alphabet;
    let seen = new Set();
    let matrix = [];

    for (let char of keyString) {
        if (!seen.has(char) && matrix.flat().length < 25) { // Ensure only 25 characters
            seen.add(char);
            if (matrix.length === 0 || matrix[matrix.length - 1].length === 5) {
                matrix.push([]);
            }
            matrix[matrix.length - 1].push(char);
        }
    }

    return matrix;
}

function createPairs(text) {
    let pairs = [];
    let i = 0;

    while (i < text.length) {
        let a = text[i];
        let b = text[i + 1] || 'X';

        if (a === b) {
            pairs.push([a, 'X']);
            i += 1;
        } else {
            pairs.push([a, b]);
            i += 2;
        }
    }

    return pairs;
}

function findPosition(char, matrix) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === char) {
                return { row: row, col: col };
            }
        }
    }
    return null;
}

function displayMatrix(matrix) {
    let container = document.getElementById('matrix-container');
    container.innerHTML = ''; // Clear any previous matrix

    let table = document.createElement('table');
    for (let row of matrix) {
        let tr = document.createElement('tr');
        for (let char of row) {
            let td = document.createElement('td');
            td.textContent = char;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    container.appendChild(table);
}
