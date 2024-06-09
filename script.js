function encrypt() {
    let plaintext = document.getElementById('plaintext').value;
    let key = document.getElementById('key').value;
    let ciphertext = playfairEncrypt(plaintext, key);
    document.getElementById('ciphertext').value = ciphertext;
}

function playfairEncrypt(plaintext, key) {
    // Clean and prepare the key and plaintext
    key = key.replace(/j/g, 'i').toUpperCase().replace(/[^A-Z]/g, '');
    plaintext = plaintext.replace(/j/g, 'i').toUpperCase().replace(/[^A-Z]/g, '');

    // Generate the 5x5 key matrix
    let matrix = generateMatrix(key);
    console.log('Matrix:', matrix); // Debugging line
    let pairs = createPairs(plaintext);
    console.log('Pairs:', pairs); // Debugging line
    let ciphertext = '';

    // Encrypt each pair
    pairs.forEach(pair => {
        console.log('Encrypting pair:', pair); // Debugging line
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
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is typically merged with I
    let keyString = key + alphabet;
    let seen = new Set();
    let matrix = [];

    for (let char of keyString) {
        if (!seen.has(char)) {
            seen.add(char);
            if (matrix.length === 0 || matrix[matrix.length - 1].length === 5) {
                matrix.push([]);
            }
            matrix[matrix.length - 1].push(char);
        }
    }

    console.log('Generated matrix:', matrix); // Debugging line
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

    console.log('Generated pairs:', pairs); // Debugging line
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
    console.error(`Character ${char} not found in matrix`); // Debugging line
    return null;
}