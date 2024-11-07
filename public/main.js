const OPEN_AI = true;

const extractBeerNamesUsingTesseract = async (photoFile) => {
    const worker = await Tesseract.createWorker('eng');
    const { data: { text } } = await worker.recognize(photoFile);
    await worker.terminate();
    return text.split(/\r?\n/)
        .filter(beer => beer !== '')
        .map(beer => beer.replace(/\s*\d+°?\d*\s*.*$/g, '').replace(/[^\w\s']/g, '').trim());
}

const readAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            return resolve({data:fileReader.result, name:file.name, size: file.size, type: file.type});
        }
        fileReader.readAsDataURL(file);
    });
}

const extractBeerNamesUsingOpenAI = async (photoFile) => {
    const base64Image = await readAsDataURL(photoFile);
    const response = await fetch("/analyseImage", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({image: base64Image.data})
    });
    return await response.json();
}

const imageInputHandler = async (event) => {
    document.getElementById('result').style.display = "none";
    document.getElementById('spinner').style.display = "block";
    const photo = document.getElementById('photo');
    const photoFile = event.srcElement.files[0];

    let beerNames = [];
    if (OPEN_AI) {
        beerNames = await extractBeerNamesUsingOpenAI(photoFile)
    } else {
        beerNames = await extractBeerNamesUsingTesseract(photoFile);
    }
    photo.src = URL.createObjectURL(photoFile);

    console.log(beerNames);

    document.getElementById('result').style.display = "block";
    document.getElementById('spinner').style.display = "none";
    document.getElementById('captureInput').value = null;
    
    for (const beerName of beerNames) {
        const response = await fetch("/rateBeer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({query: beerName})
        });
    
        const jsonResp = await response.json();
        console.log(beerName, jsonResp);
        appendBeersInTable(beerName, jsonResp.data.results.items);
    }
}

const appendBeersInTable = (beerName, beers) => {
    const tableBody = document.getElementById('beersTable').getElementsByTagName('tbody')[0];
    if (!beers) {
        return;
    }

    for (let i = 0; i < beers.length; i++) {
        const currentBeer = beers[i];
        if (!currentBeer.beer) {
            continue;
        }
        let row = "<tr>";
        row += (i==0 ? `<th rowspan="${beers.length}" scope="row">${beerName}</th>` : "");
        row += `<td><img class="beerPhoto" src="${currentBeer.beer.imageUrl}" /></td>
            <td><a href="https://www.ratebeer.com/beer/${currentBeer.beer.id}/" target="_blank">${currentBeer.beer.name}</a></td>
            <td>${currentBeer.beer.style.name}</td>
            <td>${Math.round(currentBeer.beer.overallScore * 100) / 100}</td>
            <td>${Math.round(currentBeer.beer.styleScore * 100) / 100}</td>
            <td>${currentBeer.beer.ratingsCount}</td>
            <td>${Math.round(currentBeer.beer.abv * 100) / 100}</td>
            </tr>`;
        tableBody.insertRow().innerHTML = row;
    }
}

document.getElementById("captureInput").addEventListener("input", imageInputHandler);
