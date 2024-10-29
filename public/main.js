const imageInputHandler = async (e) => {
    console.log("imageInputHandler");
    document.getElementById('result').style.display = "none";

    const photo = document.getElementById('photo');
    const photoFile = e.srcElement.files[0];
    
    const worker = await Tesseract.createWorker('eng');
    document.getElementById('spinner').style.display = "block";
    const { data: { text } } = await worker.recognize(photoFile);
    await worker.terminate();
    photo.src = URL.createObjectURL(photoFile);

    document.getElementById('result').style.display = "block";
    document.getElementById('spinner').style.display = "none";
    document.getElementById('captureInput').value = null;
    
    const beerNames = text.split(/\r?\n/)
            .filter(beer => beer !== '')
            .map(beer => beer.replace(/\s*\d+°?\d*\s*.*$/g, '').replace(/[^\w\s']/g, '').trim());
    console.log(beerNames);

    for (const beerName of beerNames) {
        const response = await fetch("http://localhost:3000/rateBeer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({query: beerName})
        });
    
        const jsonResp = await response.json();
        console.log(beerName, jsonResp);
        appendBiersInTable(beerName, jsonResp.data.results.items);
    }
}

const appendBiersInTable = (beerName, beers) => {
    const tableBody = document.getElementById('biersTable').getElementsByTagName('tbody')[0];
    if (!beers) {
        return;
    }

    for (let i = 0; i < beers.length; i++) {
        let row = "<tr>";
        row += (i==0 ? `<th rowspan="${beers.length}" scope="row">${beerName}</th>` : "");
        row += `<td><img class="beerPhoto" src="${beers[i].beer.imageUrl}" /></td>
            <td>${beers[i].beer.name}</td>
            <td>${beers[i].beer.style.name}</td>
            <td>${Math.round(beers[i].beer.overallScore * 100) / 100}</td>
            <td>${Math.round(beers[i].beer.styleScore * 100) / 100}</td>
            <td>${beers[i].beer.ratingsCount}</td>
            <td>${Math.round(beers[i].beer.abv * 100) / 100}</td>
            </tr>`;
        tableBody.insertRow().innerHTML = row;
    }
}

document.getElementById("captureInput").addEventListener("input", imageInputHandler);
