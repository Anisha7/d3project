// HELPERS
const parseCSV = csv => {
    // Format: {name: "", children: [
    //     {name: "", children: [
    //         ...
    //     ]}
    // ]}
    // TODO: USE popularity to generate top genres scores
    const genres = {} // name -> (occ, popsum)
    csv.forEach(element => {
        const g = element["Top Genre"]
        if (g in genres) {
            genres[g][0] += 1
            genres[g][1] += parseInt(element["Popularity"])

        } else {
            genres[g] = [1, parseInt(element["Popularity"])]
        }
    });

    const genreKeys = Object.keys(genres);
    const totalGenres = genreKeys.length

    genreKeys.sort(function (a, b) {
        return genres[b][1] - genres[a][1];
    })
    // find top 3 genres
    const topGenres = genreKeys.splice(0, 3) // [["genre", popularity], ...]

    console.log(topGenres)

    const data = {
        name: "genres",
        children: []
    }

    topGenres.forEach(g => {
        data.children.push(
            {
                name: g,
                value: genres[g][1] / totalGenres
                // children: getGenreChildren(g)
            }
        )
    })
    // const data = {
    //     name: "genres",
    //     children: [ // top 3 genres based on popularity
    //         {
    //             name: "top genre",
    //             children: [ // top 3 artists in that genre based on polularity
    //                 {
    //                     name: "artist",
    //                     children: [ // songs with popularity scores

    //                     ]
    //                 }
    //             ] 
    //         }
    //     ]
    // }
    return data
}