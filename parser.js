// HELPERS

const getTopSongs = (csv, artist) => {
    // [ // songs with popularity scores
    //  { name string, value: number}
    //           
    // Find all artists and their popularities in given genre          ]
    const songs = {}
    csv.filter((element) => element["Artist"] === artist).forEach(element => {
        const s = element["Title"]
        if (s in songs) {
            songs[s] += parseInt(element["Popularity"])
        } else {
            songs[s] = parseInt(element["Popularity"])
        }
    })
}

const getTopArtists = (csv, genre) => {
    // Find all artists and their popularities in given genre
    const artists = {}
    csv.filter((element) => element["Top Genre"] === genre).forEach(element => {
        const a = element["Artist"]
        if (a in artists) {
            artists[a] += parseInt(element["Popularity"])
        } else {
            artists[a] = parseInt(element["Popularity"])
        }
    })
    // Sort the artists by their popularity
    const artistKeys = Object.keys(artists);
    artistKeys.sort(function (a, b) {
        return artists[b] - artists[a];
    })

    // Find top 3 artists
    const topArtists = artistKeys.splice(0, 3) // ["genre", ...]

    const data = []
    topArtists.forEach(a => {
        data.push(
            {
                name: a,
                value: artists[a] // Is this math even logical???
                // children: getTopSongs(csv, g)
            }
        )
    })
    return data

}

const getTopGenres = (csv) => {
    // Parse genres and their popularities in a dictionary
    const genres = {} // name -> popularity
    // console.log(csv)
    csv.forEach(element => {
        const g = element["Top Genre"]
        if (g in genres) {
            genres[g] += parseInt(element["Popularity"])

        } else {
            genres[g] = parseInt(element["Popularity"])
        }
    });

    // Sort the genres by their popularity
    const genreKeys = Object.keys(genres);
    genreKeys.sort(function (a, b) {
        return genres[b] - genres[a];
    })
    // Find top 3 genres
    const topGenres = genreKeys.splice(0, 3) // ["genre", ...]

    const data = []
    topGenres.forEach(g => {
        data.push(
            {
                name: g,
                // value: genres[g] // Is this math even logical???
                children: getTopArtists(csv, g)
            }
        )
    })

    return data

}

const parseCSV = csv => {
    // Format: {name: "", children: [
    //     {name: "", children: [
    //         ...
    //     ]}
    // ]}
    // TODO: USE popularity to generate top genres scores
    console.log(csv)
    const data = {
        name: "genres",
        children: getTopGenres(csv)
    }

    
    // const data = {
    //     name: "genres",
    //     children: [ // top 3 genres based on popularity
    //         {
    //             name: "top genre",
    //             children: [ // top 3 artists in that genre based on polularity
    //                 {
    //                     name: "artist",
    //                     children: [ // songs with popularity scores

    //    ] }] }]}
    return data
}